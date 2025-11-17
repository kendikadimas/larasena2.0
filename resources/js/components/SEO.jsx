import { Head } from '@inertiajs/react';

export default function SEO({ 
    title = 'Larasena', 
    description = 'Platform desain dan produksi batik berbasis AI', 
    keywords = 'batik, desain batik, AI batik generator, motif batik',
    image = '/images/Logo.svg',
    url = null 
}) {
    const fullTitle = title === 'Larasena' ? title : `${title} Larasena`;
    
    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            
            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {url && <meta property="og:url" content={url} />}
            
            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
}
