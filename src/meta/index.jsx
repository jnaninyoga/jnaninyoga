// using Helmet to setupe mata data for each page
import { Helmet } from 'react-helmet-async'
import PropType from 'prop-types';

Meta.propTypes = {
    meta: PropType.shape({
        title: PropType.string.isRequired,
        description: PropType.string.isRequired,
        keywords: PropType.string.isRequired,
        image: PropType.string,
        url: PropType.string,
        type: PropType.oneOf(["article", "blog", "website"]),
    })
}

export default function Meta(meta) {
    const { title, description, keywords, image, url, type } = meta;

    return (
        <Helmet prioritizeSeoTags>
            <title>{title}</title>
            <meta name="author" content="Jnanin Yoga Studio"/>
            {/* Canonical */}
            <link rel="canonical" href={url}/>
            
            {/* OGP - Open Graph Protocol */}
            <meta name="title" property="og:title" content={title}/>
            <meta name="description" property="og:description" content={description}/>
            <meta name="keywords" content={keywords}/>
            <meta property="og:type" content={type || "website"}/>
            <meta property="og:url" content={url}/>
            <meta name="image" property="og:image" itemProp="image" content={import.meta.env.VITE_HOST_NAME + image}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="og:image:width" content="1280"/>
            <meta property="og:image:height" content="640"/>
            <meta property="og:image:alt" content="Jnanin Yoga Studio"/>

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={import.meta.env.VITE_HOST_NAME + image}/>
            <meta name="twitter:image:alt" content="Jnanin Yoga Studio"/>
        </Helmet>
    )
}