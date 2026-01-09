import json
from datetime import datetime
from typing import Any, Dict, List, Tuple

import httpx


KNOWLEDGE_BASE_NAME = "PeopleIntelligence"
DATASET_ID = "57482715-5e9f-49af-8609-7dba8cc70f0e"
API_KEY = "dataset-SiQnQVV65I72Yk9BuF1sDwSo"
BASE_URL = "http://gabriels-mac-studio.tail4cbdc9.ts.net:3002/v1"

DOC_TYPE_ID = "2fc3199b-6720-44cc-a812-9a01f03d63ce"
PERSON_ID_ID = "e4cd8df1-36f1-4181-b5c7-5fe9c10e9472"
PUBLISH_DATE_ID = "1d0c6b96-b2d3-461a-b9b4-fb737758ac61"
ENGAGEMENT_SCORE_ID = "fc2a8fa9-0f05-45cf-a4e6-6fcefb758370"
PERSON_NAME_ID = "715dded7-a57c-479b-accf-4ad2b4e8f2b8"

PROCESS_RULE = {
    "mode": "custom",
    "rules": {
        "pre_processing_rules": [],
        "segmentation": {
            "separator": "---",
            "max_tokens": 3000,
            "chunk_overlap": 50,
        },
        "chunking": {
            "strategy": "delimiter",
            "delimiter": "---",
            "max_chunk_length": 3000,
            "chunk_overlap": 50,
        },
    },
}


def _to_iso(posted_at: Dict[str, Any]) -> str:
    iso_val = posted_at.get("iso") or posted_at.get("timestamp_iso")
    if iso_val:
        return iso_val
    date_str = posted_at.get("date")
    try:
        return datetime.fromisoformat(date_str).isoformat() if date_str else "Unknown"
    except Exception:
        return date_str or "Unknown"


def _extract_doc_id(payload: Dict[str, Any]) -> str:
    return (
        payload.get("id")
        or (payload.get("data") or {}).get("id")
        or (payload.get("document") or {}).get("id")
    ) or ""


def _build_doc_name(full_post: Dict[str, Any], urn: str) -> str:
    headline = (
        full_post.get("headline")
        or full_post.get("title")
        or (full_post.get("text") or "").strip().splitlines()[0]
        or urn
    )
    return f"Post - {headline[:140]}"


def _build_markdown(full_post: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
    posted_at = full_post.get("posted_at", {}) or {}
    stats = full_post.get("stats", {}) or {}
    author = full_post.get("author", {}) or {}
    article = full_post.get("article", {}) or {}
    media = full_post.get("media", {}) or {}

    urn = full_post.get("full_urn", "Unknown URN")
    posted_iso = _to_iso(posted_at)
    posted_date_display = posted_at.get("date", posted_iso)

    like_count = stats.get("like", 0)
    comments_count = stats.get("comments", 0)
    engagement_score = like_count + comments_count
    total_reactions = stats.get("total_reactions", 0)
    love = stats.get("love", 0)
    celebrate = stats.get("celebrate", 0)
    insight = stats.get("insight", 0)
    support = stats.get("support", 0)
    funny = stats.get("funny", 0)
    reposts_count = stats.get("reposts", 0)

    url = full_post.get("url", "No URL")
    author_name = f"{author.get('first_name', '')} {author.get('last_name', '')}".strip()
    author_headline = author.get("headline", "")
    post_type = full_post.get("post_type", "")
    pagination_token = full_post.get("pagination_token", "")
    relative_time = posted_at.get("relative", "")
    post_text = full_post.get("text", "").strip()

    markdown_parts: List[str] = [
        "---",
        f"URN: {urn}",
        f"Author: {author_name}",
        f"Headline: {author_headline}",
        f"Date: {posted_date_display}",
        f"URL: {url}",
        f"Post Type: {post_type}",
        f"Relative Posted: {relative_time}",
        f"Pagination Token: {pagination_token}",
        f"Engagement Score (likes+comments): {engagement_score}",
        (
            "Likes: "
            f"{like_count} | Comments: {comments_count} | Reposts: {reposts_count} | Total Reactions: {total_reactions}"
        ),
        f"Reactions Breakdown: 👍{like_count} ❤️{love} 🎉{celebrate} 💡{insight} 🙌{support} 😄{funny}",
        "---",
        "",
        "### Post Text",
        post_text or "No text provided.",
        "",
    ]

    if article:
        markdown_parts.extend(
            [
                "### Article",
                f"- Title: {article.get('title', 'N/A')}",
                f"- Source: {article.get('subtitle', 'N/A')}",
                f"- URL: {article.get('url', 'N/A')}",
                f"- Thumbnail: {article.get('thumbnail', 'N/A')}",
                "",
            ]
        )

    if media:
        markdown_parts.extend(
            [
                "### Media",
                f"- Type: {media.get('type', 'N/A')}",
                f"- URL: {media.get('url', 'N/A')}",
                "",
            ]
        )

    urn_obj = full_post.get("urn", {}) if isinstance(full_post.get("urn"), dict) else {}
    if urn_obj.get("activity_urn") or urn_obj.get("share_urn"):
        markdown_parts.extend(
            [
                "### URN Details",
                f"- Activity URN: {urn_obj.get('activity_urn', 'N/A')}",
                f"- Share URN: {urn_obj.get('share_urn', 'N/A')}",
                f"- UGC Post URN: {urn_obj.get('ugcPost_urn', 'N/A')}",
                "",
            ]
        )

    metadata_values = {
        "urn": urn,
        "posted_iso": posted_iso,
        "engagement_score": engagement_score,
        "author_person_id": author.get("id") or author.get("profile_id") or "",
        "author_name": author_name,
    }

    return "\n".join(markdown_parts), metadata_values


def main(posts: Any, person_id: str = "") -> Dict[str, Any]:
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

    if posts is None:
        return {"result": "Error: input is null", "total_processed": 0, "raw_posts": []}

    # Normalize input
    if isinstance(posts, str):
        try:
            posts = json.loads(posts)
        except Exception:
            return {"result": "Error: input string is not valid JSON", "total_processed": 0, "raw_posts": []}
    if isinstance(posts, dict) and "posts" in posts:
        posts = posts["posts"]
    if not isinstance(posts, list):
        return {
            "result": f"Error: Input is not a list. Received type: {type(posts)}",
            "total_processed": 0,
            "raw_posts": [],
        }

    logs: List[str] = []
    kb_sections: List[str] = []
    raw_posts: List[Dict[str, Any]] = []
    count_processed = count_created = count_skipped = count_errors = 0

    for post in posts:
        count_processed += 1
        full_post = post.get("full_version") or post
        urn = post.get("full_urn") or full_post.get("full_urn")
        posted_at = full_post.get("posted_at", {}) or {}
        stats = full_post.get("stats", {}) or {}
        author = full_post.get("author", {}) or {}

        like_count = stats.get("like", 0)
        comments_count = stats.get("comments", 0)
        engagement_score = like_count + comments_count
        posted_iso = _to_iso(posted_at)

        if not urn:
            logs.append("Skipped: Item missing 'full_urn'")
            count_errors += 1
            continue

        raw_posts.append(full_post)

        # Dedupe against knowledge base
        try:
            check_url = f"{BASE_URL}/datasets/{DATASET_ID}/retrieve"
            body = {
                "query": urn,
                "retrieval_model": {
                    "search_method": "keyword_search",
                    "reranking_enable": False,
                    "top_k": 1,
                    "score_threshold_enabled": False,
                },
            }
            r = httpx.post(check_url, headers=headers, json=body, timeout=10)
            if r.status_code == 200 and r.json().get("records"):
                logs.append(f"Skipped (Exists): {urn}")
                count_skipped += 1
                continue
            if r.status_code != 200:
                logs.append(f"Error Checking {urn}: {r.status_code} Body: {r.text}")
                count_errors += 1
                continue
        except Exception as exc:
            logs.append(f"Exception Checking {urn}: {exc}")
            count_errors += 1
            continue

        markdown, metadata_values = _build_markdown(full_post)
        kb_sections.append(markdown)

        # Create doc with enforced 1-post=1-chunk chunking
        try:
            create_url = f"{BASE_URL}/datasets/{DATASET_ID}/document/create_by_text"
            doc_name = _build_doc_name(full_post, urn)
            doc_body = {
                "name": doc_name,
                "text": markdown,
                "indexing_technique": "high_quality",
                "process_rule": PROCESS_RULE,
            }
            create_resp = httpx.post(create_url, headers=headers, json=doc_body, timeout=20)
            if create_resp.status_code == 200:
                body_json: Dict[str, Any] = {}
                try:
                    body_json = create_resp.json()
                except Exception:
                    pass
                doc_id = _extract_doc_id(body_json)
                if not doc_id:
                    logs.append(f"Create OK but missing doc_id for {urn}. Body: {create_resp.text}")
                    count_errors += 1
                    continue

                metadata_url = f"{BASE_URL}/datasets/{DATASET_ID}/documents/metadata"
                meta_payload = {
                    "operation_data": [
                        {
                            "document_id": doc_id,
                            "metadata_list": [
                                {"id": DOC_TYPE_ID, "name": "doc_type", "value": "Post"},
                                {
                                    "id": PERSON_ID_ID,
                                    "name": "person_id",
                                    "value": person_id or metadata_values["author_person_id"] or "unknown",
                                },
                                {
                                    "id": PERSON_NAME_ID,
                                    "name": "person",
                                    "value": metadata_values.get("author_name") or "unknown",
                                },
                                {"id": PUBLISH_DATE_ID, "name": "publish_date", "value": posted_iso},
                                {
                                    "id": ENGAGEMENT_SCORE_ID,
                                    "name": "engagement_score",
                                    "value": str(metadata_values["engagement_score"]),
                                },
                            ],
                        }
                    ]
                }
                meta_resp = httpx.post(metadata_url, headers=headers, json=meta_payload, timeout=10)
                if meta_resp.status_code != 200:
                    logs.append(
                        f"Created {urn} but metadata failed: {meta_resp.status_code} Body: {meta_resp.text}"
                    )
                    count_errors += 1
                else:
                    logs.append(f"Created: {urn} (metadata assigned)")
                    count_created += 1
            else:
                logs.append(f"Failed Create {urn}: {create_resp.status_code} Body: {create_resp.text}")
                count_errors += 1
        except Exception as exc:
            logs.append(f"Exception Creating {urn}: {exc}")
            count_errors += 1

    summary = (
        f"## 🎯 LinkedIn Posts Summary ({KNOWLEDGE_BASE_NAME})\n"
        f"Processed: {count_processed} | New: {count_created} | Already Exists: {count_skipped} | Errors: {count_errors}\n\n"
        f"{chr(10).join(kb_sections)}\n\n"
        f"### Debug Log\n- " + "\n- ".join(logs)
    )

    return {
        "result": summary,
        "total_processed": count_processed,
        "raw_posts": raw_posts,
    }
