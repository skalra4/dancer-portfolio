import { defineQuery } from "next-sanity";

/**
 * GROQ query for the siteSettings singleton.
 *
 * Projects all editable site-wide fields into a flat object that maps
 * directly to the SiteSettings type in sanity/lib/fetch.ts.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteName,
    siteTagline,
    seoDescription,
    "heroImageUrl": heroImage.asset->url,
    heroRoleTagline,
    heroHeadline,
    heroSubtitle,
    heroCtaLabel,
    heroCtaHref,
    bio,
    bioTeaser,
    socialInstagram,
    socialYoutube,
    socialTiktok,
    socialTwitter,
    socialFacebook,
    socialLinkedin,
    "resumePdfUrl": resumePdf.asset->url,
    "writingSamplePdfUrl": writingSamplePdf.asset->url,
    contactTitle,
    contactDescription,
    contactEmail,
    contactPhone,
    "aboutImageUrl": aboutImage.asset->url,
    "aboutImageAlt": aboutImage.alt,
    "aboutImageWidth": aboutImage.asset->metadata.dimensions.width,
    "aboutImageHeight": aboutImage.asset->metadata.dimensions.height,
    "contactImageUrl": contactImage.asset->url,
    "contactImageAlt": contactImage.alt,
    "contactImageWidth": contactImage.asset->metadata.dimensions.width,
    "contactImageHeight": contactImage.asset->metadata.dimensions.height
  }
`);

/**
 * GROQ query for all portfolio items.
 *
 * The projection maps Sanity document fields → the flat `RawPortfolioItem`
 * shape in data/content.ts so the normalisation layer works identically
 * whether the source is Sanity or the static JSON fallback.
 *
 * Key projections:
 *   "id"        ← Sanity's _id (our normaliser expects `id`)
 *   "type"      ← mediaType field  (image | video | social)
 *   "src"       ← image URL for images, videoId for video, postId for social
 *   "provider"  ← videoProvider or socialProvider depending on mediaType
 *   "thumbnail" ← custom thumbnail URL (video only, optional)
 */
export const PORTFOLIO_QUERY = defineQuery(`
  *[_type == "portfolioItem"] | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    title,
    category,
    "type": mediaType,
    "src": select(
      mediaType == "image"  => image.asset->url,
      mediaType == "video"  => videoId,
      mediaType == "social" => postId
    ),
    "provider": select(
      mediaType == "video"  => videoProvider,
      mediaType == "social" => socialProvider
    ),
    "thumbnail": thumbnail.asset->url,
    colSpan
  }
`);

/**
 * GROQ query for all resume sections.
 *
 * Projects to the `RawResumeSection` shape: { id, heading, items[] }.
 * Each item uses `_key` (Sanity's auto-generated array item key) as `id`
 * to satisfy the normaliser's `id` requirement.
 */
export const RESUME_SECTIONS_QUERY = defineQuery(`
  *[_type == "resumeSection"] | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    heading,
    items[] {
      "id": _key,
      title,
      subtitle,
      meta,
      notes
    }
  }
`);
