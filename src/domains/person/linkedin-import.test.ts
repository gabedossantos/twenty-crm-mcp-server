
import { describe, it, expect, vi } from 'vitest';
import { importLinkedInProfile } from './linkedin-import';
import { GraphQLClient } from '../../shared/graphql-client';

// Mock GraphQL Client
const mockRequest = vi.fn();
const mockClient = {
    request: mockRequest,
} as unknown as GraphQLClient;

describe('importLinkedInProfile', () => {
    it('should handle descPreview for featured items robustly (User Issue Case 1)', async () => {
        // This input corresponds to the first failing example provided by the user
        // causing "descPreview.replace is not a function"
        const input = {
            personId: 'test-person-id',
            apifyData: JSON.stringify({
                basic_info: {
                    first_name: 'Volodymyr',
                    last_name: 'Kuts',
                    // ... minimal required fields
                },
                featured: [
                    {
                        "type": "document",
                        "title": "The First AI2H Technology for LinkedIn Growth.pdf",
                        "description": {
                            "textDirection": "USER_LOCALE",
                            "text": "The main Profigent.ai presentation. I explain what AI2H technology is and how it turns LinkedIn into a lead-generation machine.",
                            "accessibilityText": "The main Profigent.ai presentation...",
                            "$recipeTypes": [
                                "com.linkedin.ad7072445cd98f6941448854defe93ec"
                            ],
                            "$type": "com.linkedin.voyager.dash.common.text.TextViewModel"
                        },
                        "url": "https://www.linkedin.com/in/kutsvladimir/overlay/1759159613946/single-media-viewer?type=DOCUMENT&profileId=ACoAABNKVmkBiZ9P2qnuMRzdDwM6RWUCS5ml1jY"
                    }
                ]
            })
        };

        mockRequest.mockResolvedValue({ updatePerson: { id: 'test-person-id' } });

        const result = await importLinkedInProfile(mockClient, input);

        expect(result.isError).toBeFalsy();
        // expect(result.success).toBe(true); // Removed as property doesn't exist
        expect(result.structuredData?.additionalInformation).toContain("The main Profigent.ai presentation");
    });

    it('should handle descPreview for featured items robustly (User Issue Case 2)', async () => {
        // This input corresponds to the third example (Gallup Leadership Profile)
        // where description might be an object WITHOUT text property or just complex structure
        const input = {
            personId: 'test-person-id-2',
            apifyData: JSON.stringify({
                basic_info: {
                    first_name: 'Renato',
                    last_name: 'Guidio',
                },
                featured: [
                    {
                        "type": "document",
                        "title": "Gallup Leadership Profile",
                        "description": {
                            "textDirection": "USER_LOCALE",
                            "$recipeTypes": [
                                "com.linkedin.ad7072445cd98f6941448854defe93ec"
                            ],
                            "$type": "com.linkedin.voyager.dash.common.text.TextViewModel"
                        },
                        "url": "https://www.linkedin.com/in/renatoguidio/overlay/1541954407904/single-media-viewer?type=DOCUMENT&profileId=ACoAAAN3PZABqDLifYxI3y6DgymXsprmvazqLb8"
                    }
                ]
            })
        };

        mockRequest.mockResolvedValue({ updatePerson: { id: 'test-person-id-2' } });

        const result = await importLinkedInProfile(mockClient, input);

        expect(result.isError).toBeFalsy();
        // In this case, description.text is undefined, so it should be empty string
        // And descPreview should handle it gracefully
    });

    it('should handle non-string description (e.g. number) explicitly', async () => {
        const input = {
            personId: 'test-id',
            apifyData: JSON.stringify({
                basic_info: { first_name: 'Test' },
                featured: [
                    {
                        type: 'post',
                        title: 'Test Post',
                        // @ts-ignore
                        description: 12345 // Explicitly passing a number to break string methods
                    }
                ]
            })
        };

        mockRequest.mockResolvedValue({});
        const result = await importLinkedInProfile(mockClient, input);

        expect(result.isError).toBeFalsy();
        expect(result.structuredData?.additionalInformation).toContain("12345");
    });
});
