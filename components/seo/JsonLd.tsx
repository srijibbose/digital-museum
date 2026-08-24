import { serializeJsonLd } from "@/lib/seo/json-ld";

interface JsonLdProps {
  data: object | readonly object[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
