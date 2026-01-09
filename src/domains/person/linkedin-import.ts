/**
 * LinkedIn Profile Import Handler
 * 
 * Parses Apify LinkedIn scraper output and formats it for Twenty CRM.
 * All transformation logic lives here - keeps Dify workflows simple.
 */

import { GraphQLClient } from "../../shared/graphql-client.js";
import { transformLink } from "../../shared/transformers.js";
import { UPDATE_PERSON_MUTATION } from "./queries.js";
import { Person, PersonGraphQLInput } from "./types.js";

// ======================
// TYPES
// ======================

export interface ImportLinkedInProfileInput {
  personId: string;
  apifyData: string;
}

interface ApifyBasicInfo {
  fullname?: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  public_identifier?: string;
  profile_url?: string;
  profile_picture_url?: string;
  background_picture_url?: string;
  about?: string;
  summary?: string;
  email?: string | null;
  location?: {
    country?: string;
    city?: string;
    full?: string;
    country_code?: string;
  } | string;
  follower_count?: number;
  connection_count?: number;
  current_company?: string;
  current_company_url?: string;
  current_company_urn?: string;
  top_skills?: string[];
  creator_hashtags?: string[];
  is_creator?: boolean;
  is_influencer?: boolean;
  is_premium?: boolean;
  open_to_work?: boolean;
  urn?: string;
}

interface ApifyExperience {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  duration?: string;
  start_date?: { year?: number; month?: string };
  end_date?: { year?: number; month?: string };
  is_current?: boolean;
  company_linkedin_url?: string;
  company_logo_url?: string;
  employment_type?: string;
  skills?: string[];
}

interface ApifyEducation {
  school?: string;
  school_name?: string;
  degree?: string;
  degree_name?: string;
  field_of_study?: string;
  duration?: string;
  start_date?: { year?: number };
  end_date?: { year?: number };
  school_linkedin_url?: string;
}

interface ApifyCertification {
  name?: string;
  issuer?: string;
  issued_date?: string;
}

interface ApifyProject {
  name?: string;
  description?: string;
  associated_with?: string;
  is_current?: boolean;
  start_date?: { year?: number; month?: string };
  end_date?: { year?: number; month?: string };
}

interface ApifyFeatured {
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  image_url?: string;
  date?: string;
  issuer?: string;
  social_counts?: {
    likes?: number;
    comments?: number;
  };
}

interface ApifyProfile {
  basic_info?: ApifyBasicInfo;
  experience?: ApifyExperience[];
  education?: ApifyEducation[];
  projects?: ApifyProject[];
  certifications?: ApifyCertification[];
  featured?: ApifyFeatured[];
  skills?: Array<string | { name?: string }>;
  languages?: Array<string | { language?: string; name?: string; proficiency?: string }>;
}

interface ImportResult {
  success: boolean;
  summary: string;
  fieldsUpdated: string[];
  profileScore: number;
  errors: string[];
  // Structured output for Dify downstream nodes - ALL data preserved
  data: {
    // Identity
    personId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;  // Empty string if null, never "null"
    urn: string;    // LinkedIn URN identifier

    // Professional
    headline: string;  // Full LinkedIn headline
    jobTitle: string;
    currentCompany: string;
    currentCompanyUrl: string;

    // Location
    location: string;      // Full location string
    country: string;       // Country only
    city: string;          // City only

    // URLs
    linkedinUrl: string;
    profilePictureUrl: string;
    backgroundPictureUrl: string;

    // Content (full rich text)
    about: string;         // Full about/summary text
    experience: string;    // FULL markdown with all experience entries
    education: string;     // FULL markdown with all education entries
    languages: string;     // Formatted languages string
    additionalInformation: string;  // Projects + Certifications + Featured combined

    // Metrics
    followerCount: number;
    connectionCount: number;
    linkedinScore: number;
  };
}

// ======================
// HELPER FUNCTIONS
// ======================

function formatExperienceMarkdown(experiences: ApifyExperience[]): string {
  if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
    return "";
  }

  const lines: string[] = [];

  for (const exp of experiences.slice(0, 15)) {
    const title = exp.title || "Unknown Role";
    const company = exp.company || "Unknown Company";
    const location = exp.location || "";
    const duration = exp.duration || "";
    let description: any = exp.description || "";
    if (typeof description === "object" && description !== null && description.text) {
      description = description.text;
    }
    if (typeof description !== "string") {
      description = "";
    }
    const isCurrent = exp.is_current || false;
    const companyUrl = exp.company_linkedin_url || "";
    const employmentType = exp.employment_type || "";

    // Header with current indicator
    const currentBadge = isCurrent ? " 🟢" : "";
    lines.push(`### ${title} @ ${company}${currentBadge}`);

    // Details
    if (duration) lines.push(`📅 ${duration}`);
    if (location) lines.push(`📍 ${location}`);
    if (employmentType) lines.push(`💼 ${employmentType}`);
    if (companyUrl) lines.push(`🔗 [Company LinkedIn](${companyUrl})`);
    if (description) {
      // Clean and add description
      const cleanDesc = description.replace(/\n+/g, " ").trim();
      lines.push("");
      lines.push(cleanDesc);
    }

    lines.push(""); // Blank line between entries
  }

  return lines.join("\n").trim();
}

function formatEducationMarkdown(education: ApifyEducation[]): string {
  if (!education || !Array.isArray(education) || education.length === 0) {
    return "";
  }

  const lines: string[] = [];

  for (const edu of education.slice(0, 10)) {
    const school = edu.school || edu.school_name || "Unknown School";
    const degree = edu.degree || edu.degree_name || "";
    const field = edu.field_of_study || "";
    const duration = edu.duration || "";
    const schoolUrl = edu.school_linkedin_url || "";

    // Combine degree and field
    let degreeText = degree;
    if (field && !degree.includes(field)) {
      degreeText = degree ? `${degree}, ${field}` : field;
    }

    lines.push(`### 🎓 ${school}`);
    if (degreeText) lines.push(`**${degreeText}**`);
    if (duration) lines.push(`📅 ${duration}`);
    if (schoolUrl) lines.push(`🔗 [School LinkedIn](${schoolUrl})`);
    lines.push("");
  }

  return lines.join("\n").trim();
}

function formatCertificationsMarkdown(certs: ApifyCertification[]): string {
  if (!certs || !Array.isArray(certs) || certs.length === 0) {
    return "";
  }

  const lines: string[] = ["## 📜 Certifications", ""];

  for (const cert of certs.slice(0, 10)) {
    const name = cert.name || "Unknown Certification";
    const issuer = cert.issuer || "";
    const issuedDate = cert.issued_date || "";

    lines.push(`- **${name}**`);
    if (issuer) lines.push(`  - Issuer: ${issuer}`);
    if (issuedDate) lines.push(`  - ${issuedDate}`);
  }

  return lines.join("\n").trim();
}

function formatFeaturedMarkdown(featured: ApifyFeatured[]): string {
  if (!featured || !Array.isArray(featured) || featured.length === 0) {
    return "";
  }

  const lines: string[] = ["## ⭐ Featured Content", ""];

  for (const item of featured.slice(0, 5)) {
    const itemType = item.type || "post";
    const title = item.title || "";
    let description: any = item.description || "";
    // Handle description as object (with .text) or string
    if (typeof description === "object" && description !== null && description.text) {
      description = description.text;
    }
    if (typeof description !== "string") {
      // Coerce number/bool to string, or default to empty
      description = description ? String(description) : "";
    }
    const url = item.url || "";
    const social = item.social_counts || {};
    const likes = social.likes || 0;
    const comments = social.comments || 0;

    // Truncate description and ensure it's a string
    let descPreview: string = "";
    if (typeof description === "string") {
      descPreview = description.length > 200
        ? description.substring(0, 200) + "..."
        : description;
    } else {
      descPreview = "";
    }

    // Always ensure descPreview is a string before .replace
    if (typeof descPreview !== "string") {
      descPreview = String(descPreview ?? "");
    }
    // Double check just in case, though the above should cover it
    if (descPreview && typeof descPreview !== "string") {
      descPreview = String(descPreview);
    }

    const header = title || itemType.charAt(0).toUpperCase() + itemType.slice(1);
    lines.push(`### ${header}`);
    if (descPreview) {
      // Safe replacement
      const safeDesc = String(descPreview).replace(/\n/g, " ");
      lines.push(`> ${safeDesc}`);
    }
    if (likes || comments) lines.push(`👍 ${likes} likes | 💬 ${comments} comments`);
    if (url) lines.push(`[View on LinkedIn](${url})`);
    lines.push("");
  }

  return lines.join("\n").trim();
}

function formatSkillsMarkdown(
  skills: Array<string | { name?: string }>,
  topSkills?: string[]
): string {
  const lines: string[] = [];

  if (topSkills && Array.isArray(topSkills) && topSkills.length > 0) {
    lines.push(`**Top Skills:** ${topSkills.slice(0, 5).join(", ")}`);
  }

  if (skills && Array.isArray(skills) && skills.length > 0) {
    const skillNames: string[] = [];
    for (const s of skills.slice(0, 20)) {
      if (typeof s === "string") {
        skillNames.push(s);
      } else if (s && typeof s === "object" && s.name) {
        skillNames.push(s.name);
      }
    }
    if (skillNames.length > 0) {
      lines.push(`**All Skills:** ${skillNames.join(", ")}`);
    }
  }

  return lines.join("\n").trim();
}

function extractLanguages(
  languages: Array<string | { language?: string; name?: string; proficiency?: string }>
): string {
  if (!languages || !Array.isArray(languages)) return "";

  const langParts: string[] = [];
  for (const l of languages) {
    if (typeof l === "string") {
      langParts.push(l);
    } else if (l && typeof l === "object") {
      const name = l.language || l.name || "";
      const proficiency = l.proficiency || "";
      if (name) {
        langParts.push(proficiency ? `${name} (${proficiency})` : name);
      }
    }
  }

  return langParts.join(", ");
}

function formatProjectsMarkdown(projects: ApifyProject[]): string {
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return "";
  }

  const lines: string[] = ["## 📁 Projects", ""];

  for (const proj of projects.slice(0, 10)) {
    const name = proj.name || "Untitled Project";
    let description: any = proj.description || "";
    if (typeof description === "object" && description !== null && description.text) {
      description = description.text;
    }
    if (typeof description !== "string") {
      description = "";
    }
    const associatedWith = proj.associated_with || "";
    const isCurrent = proj.is_current || false;

    const currentBadge = isCurrent ? " 🟢" : "";
    lines.push(`### ${name}${currentBadge}`);
    if (associatedWith) lines.push(`🏢 ${associatedWith}`);
    if (description) {
      const cleanDesc = description.replace(/\n+/g, " ").trim();
      lines.push("");
      lines.push(cleanDesc);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

function calculateProfileScore(profile: ApifyProfile, basic: ApifyBasicInfo): number {
  let score = 0;

  // Basic info
  if (basic.first_name && basic.last_name) score += 10;
  if (basic.location) score += 5;
  if (basic.about && basic.about.length > 100) score += 15;
  else if (basic.about) score += 5;
  if (basic.profile_picture_url) score += 5;

  // Experience
  const expCount = profile.experience?.length || 0;
  if (expCount >= 3) score += 25;
  else if (expCount >= 1) score += 15;

  // Education
  if (profile.education && profile.education.length > 0) score += 15;

  // Skills
  const hasSkills = (profile.skills && profile.skills.length > 0) ||
    (basic.top_skills && basic.top_skills.length > 0);
  if (hasSkills) score += 15;

  // Languages
  if (profile.languages && profile.languages.length > 0) score += 5;

  // Certifications
  if (profile.certifications && profile.certifications.length > 0) score += 5;

  // Featured content
  if (profile.featured && profile.featured.length > 0) score += 5;

  return Math.min(score, 100);
}

function parseApifyData(jsonString: string): ApifyProfile {
  let data: unknown;

  try {
    data = JSON.parse(jsonString);
  } catch {
    throw new Error("Invalid JSON: Could not parse apifyData");
  }

  // Handle array response (Apify returns array)
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error("Empty array: No profile data found");
    }
    data = data[0];
  }

  // Handle nested structures
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // Check for dataset_items wrapper
    if (obj.dataset_items && Array.isArray(obj.dataset_items) && obj.dataset_items.length > 0) {
      data = obj.dataset_items[0];
    }
    // Check for data wrapper
    else if (obj.data) {
      if (Array.isArray(obj.data) && obj.data.length > 0) {
        data = obj.data[0];
      } else if (typeof obj.data === "object") {
        data = obj.data;
      }
    }
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid data structure: Expected profile object");
  }

  return data as ApifyProfile;
}

// ======================
// MAIN IMPORT FUNCTION
// ======================

export async function importLinkedInProfile(
  client: GraphQLClient,
  input: ImportLinkedInProfileInput
): Promise<{
  content: Array<{ type: string; text: string }>;
  structuredData?: ImportResult["data"];
  isError?: boolean
}> {
  const emptyData: ImportResult["data"] = {
    // Identity
    personId: input.personId,
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",  // Empty string, never "null"
    urn: "",    // LinkedIn URN identifier

    // Professional
    headline: "",
    jobTitle: "",
    currentCompany: "",
    currentCompanyUrl: "",

    // Location
    location: "",
    country: "",
    city: "",

    // URLs
    linkedinUrl: "",
    profilePictureUrl: "",
    backgroundPictureUrl: "",

    // Content (full rich text)
    about: "",
    experience: "",
    education: "",
    languages: "",
    additionalInformation: "",

    // Metrics
    followerCount: 0,
    connectionCount: 0,
    linkedinScore: 0,
  };

  const result: ImportResult = {
    success: false,
    summary: "",
    fieldsUpdated: [],
    profileScore: 0,
    errors: [],
    data: { ...emptyData },
  };

  try {
    // 1. Parse the Apify data
    const profile = parseApifyData(input.apifyData);

    // Get basic info (might be nested or at root)
    const basic: ApifyBasicInfo = profile.basic_info || (profile as unknown as ApifyBasicInfo);

    // 2. Extract ALL fields - leave nothing behind

    // Identity
    const firstName = (basic.first_name || "").trim();
    const lastName = (basic.last_name || "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
    // Email: empty string if null/undefined, never the string "null"
    const email = (basic.email && basic.email !== "null") ? basic.email : "";

    // Professional
    const headline = basic.headline || "";  // Full original headline
    let jobTitle = headline;  // Use headline as jobTitle, with fallback
    if (!jobTitle && profile.experience && profile.experience.length > 0) {
      const firstExp = profile.experience[0];
      if (firstExp.title && firstExp.company) {
        jobTitle = `${firstExp.title} at ${firstExp.company}`;
      }
    }
    const currentCompany = basic.current_company || "";
    const currentCompanyUrl = basic.current_company_url || "";

    // Location - extract all components
    let location = "";
    let country = "";
    let city = "";
    if (basic.location) {
      if (typeof basic.location === "string") {
        location = basic.location;
        city = basic.location;
      } else {
        location = basic.location.full || "";
        country = basic.location.country || "";
        city = basic.location.city || "";
      }
    }

    // URLs
    const linkedinUrl = basic.profile_url || "";
    const profilePictureUrl = basic.profile_picture_url || "";
    const backgroundPictureUrl = basic.background_picture_url || "";
    const urn = basic.urn || "";  // LinkedIn URN identifier

    // Content - full rich text
    const about = (basic.about || basic.summary || "").trim();

    // Format experience as FULL markdown (all entries with all details)
    const experienceMd = formatExperienceMarkdown(profile.experience || []);

    // Format education as FULL markdown (all entries with all details)
    const educationMd = formatEducationMarkdown(profile.education || []);

    // Languages with proficiency
    const languages = extractLanguages(profile.languages || []);

    // Build additionalInformation from projects, certifications, featured, skills
    const additionalParts: string[] = [];

    // Projects first
    const projectsMd = formatProjectsMarkdown(profile.projects || []);
    if (projectsMd) additionalParts.push(projectsMd);

    // Certifications
    const certsMd = formatCertificationsMarkdown(profile.certifications || []);
    if (certsMd) additionalParts.push(certsMd);

    // Featured content
    const featuredMd = formatFeaturedMarkdown(profile.featured || []);
    if (featuredMd) additionalParts.push(featuredMd);

    // Skills
    const skillsMd = formatSkillsMarkdown(profile.skills || [], basic.top_skills);
    if (skillsMd) additionalParts.push("## 🛠️ Skills\n\n" + skillsMd);

    // Creator hashtags
    if (basic.creator_hashtags && basic.creator_hashtags.length > 0) {
      additionalParts.push(
        "## #️⃣ Creator Topics\n\n" +
        basic.creator_hashtags.map(h => `#${h}`).join(", ")
      );
    }

    // Profile badges
    const badges: string[] = [];
    if (basic.is_creator) badges.push("🎨 Creator");
    if (basic.is_influencer) badges.push("🌟 Influencer");
    if (basic.is_premium) badges.push("💎 Premium");
    if (badges.length > 0) {
      additionalParts.push("## 🏷️ Profile Badges\n\n" + badges.join(" | "));
    }

    // Add URN to additional information for reference
    if (urn) {
      additionalParts.push("## 🔗 LinkedIn URN\n\n`" + urn + "`");
    }

    const additionalInfo = additionalParts.join("\n\n---\n\n");

    // Numeric fields
    const followerCount = basic.follower_count || 0;
    const connectionCount = basic.connection_count || 0;
    const linkedinScore = calculateProfileScore(profile, basic);

    // 3. Build GraphQL update payload
    const updateInput: Partial<PersonGraphQLInput> = {};

    if (firstName) {
      updateInput.name = { firstName, lastName: lastName || "" };
      result.fieldsUpdated.push("name");
    }
    if (city) {
      updateInput.city = city;
      result.fieldsUpdated.push("city");
    }
    if (jobTitle) {
      updateInput.jobTitle = jobTitle.substring(0, 200);
      result.fieldsUpdated.push("jobTitle");
    }
    if (linkedinUrl) {
      updateInput.linkedinLink = transformLink(linkedinUrl);
      result.fieldsUpdated.push("linkedinUrl");
    }
    if (profilePictureUrl) {
      updateInput.imageUrl = transformLink(profilePictureUrl, "Profile Picture");
      result.fieldsUpdated.push("imageUrl");
    }
    if (about) {
      updateInput.description = about.substring(0, 5000);
      result.fieldsUpdated.push("description/about");
    }
    if (experienceMd) {
      updateInput.experience = experienceMd.substring(0, 10000);
      result.fieldsUpdated.push("experience");
    }
    if (educationMd) {
      updateInput.education = educationMd.substring(0, 5000);
      result.fieldsUpdated.push("education");
    }
    if (additionalInfo) {
      updateInput.additionalInformation = additionalInfo.substring(0, 10000);
      result.fieldsUpdated.push("additionalInformation");
    }
    if (languages) {
      updateInput.languages = languages;
      result.fieldsUpdated.push("languages");
    }

    // Add numeric fields directly to the mutation variables
    // Twenty CRM uses lowercase field names for custom fields
    const numericFields: Record<string, number> = {};
    if (followerCount > 0) {
      numericFields.followercount = followerCount;
      result.fieldsUpdated.push("followercount");
    }
    if (connectionCount > 0) {
      numericFields.connectioncount = connectionCount;
      result.fieldsUpdated.push("connectioncount");
    }
    if (linkedinScore > 0) {
      numericFields.linkedinscore = linkedinScore;
      result.fieldsUpdated.push("linkedinscore");
    }

    // Merge numeric fields into update input
    const fullInput = { ...updateInput, ...numericFields };

    // 4. Execute the update
    if (Object.keys(fullInput).length === 0) {
      result.success = true;
      result.summary = "No fields to update - profile data was empty or already matches.";
    } else {
      await client.request<{ updatePerson: Person }>(
        UPDATE_PERSON_MUTATION,
        {
          id: input.personId,
          input: fullInput,
        }
      );

      result.success = true;
      result.profileScore = linkedinScore;

      // Populate structured data for downstream Dify nodes - ALL DATA
      result.data = {
        // Identity
        personId: input.personId,
        firstName,
        lastName,
        fullName,
        email,  // Empty string if null, never "null"
        urn,    // LinkedIn URN identifier

        // Professional
        headline,  // Full original headline
        jobTitle: jobTitle.substring(0, 200),
        currentCompany,
        currentCompanyUrl,

        // Location
        location,
        country,
        city,

        // URLs
        linkedinUrl,
        profilePictureUrl,
        backgroundPictureUrl,

        // Content - FULL rich text, not just counts
        about,
        experience: experienceMd,      // Full markdown with all entries
        education: educationMd,        // Full markdown with all entries
        languages,
        additionalInformation: additionalInfo,  // Projects + Certifications + Featured + URN

        // Metrics
        followerCount,
        connectionCount,
        linkedinScore,
      };

      const expCount = profile.experience?.length || 0;
      const eduCount = profile.education?.length || 0;
      const certCount = profile.certifications?.length || 0;
      const projCount = profile.projects?.length || 0;
      const featuredCount = profile.featured?.length || 0;

      result.summary = [
        `## ✅ LinkedIn Profile Imported`,
        ``,
        `**${fullName}**`,
        currentCompany ? `🏢 ${currentCompany}` : "",
        jobTitle ? `*${jobTitle}*` : "",
        location ? `📍 ${location}` : "",
        ``,
        `### 📊 Profile Stats`,
        `- **Followers:** ${followerCount.toLocaleString()}`,
        `- **Connections:** ${connectionCount.toLocaleString()}`,
        `- **Completeness Score:** ${linkedinScore}/100`,
        ``,
        `### 📋 Data Imported`,
        `- Experience entries: ${expCount}`,
        `- Education entries: ${eduCount}`,
        `- Projects: ${projCount}`,
        `- Certifications: ${certCount}`,
        `- Featured items: ${featuredCount}`,
        languages ? `- Languages: ${languages}` : "",
        ``,
        `### 🔄 Fields Updated`,
        result.fieldsUpdated.map(f => `- ${f}`).join("\n"),
      ].filter(Boolean).join("\n");
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMessage);
    result.summary = `## ❌ Import Failed\n\nError: ${errorMessage}`;

    return {
      content: [{ type: "text", text: result.summary }],
      structuredData: result.data,
      isError: true,
    };
  }

  return {
    content: [{ type: "text", text: result.summary }],
    structuredData: result.data,
  };
}
