// using Helmet to setupe mata data for each page
import { Helmet } from 'react-helmet'
import { useActivePage } from '../hooks';
import PropType from 'prop-types';
import metadata, { HostName } from './meta';

Meta.propTypes = {
    meta: PropType.shape({
        title: PropType.string,
        // description: PropType.string.isRequired,
        // keywords: PropType.string.isRequired,
        // ogp: PropType.shape({
        //     image: PropType.string.isRequired,
        //     imageAlt: PropType.string,
        //     url: PropType.string,
        //     type: PropType.oneOf(["article", "blog", "website"])
        // }).isRequired,
        children: PropType.node
    })
}



export default function Meta(meta) {
    const { title } = meta;
    const activePage = useActivePage();
    const { description, keywords, image, url, type } = metadata[activePage];

    return (
        <Helmet prioritizeSeoTags>
            <title>{title || (activePage.toCapitalCase() + " - Jnanin Yoga Studio")}</title>
            <meta name="author" content="Jnanin Yoga Studio"/>
            {/* Canonical */}
            <link rel="canonical" href="https://jnaninyoga.com/"/>
            
            {/* OGP - Open Graph Protocol */}
            <meta name="title" property="og:title" content={title || (activePage.toCapitalCase() + " - Jnanin Yoga Studio")}/>
            <meta name="description" property="og:description" content={description}/>
            <meta name="keywords" content={keywords}/>
            <meta property="og:type" content={type || "website"}/>
            <meta property="og:url" content={url}/>
            <meta name="image" property="og:image" itemProp="image" content={HostName + image}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="og:image:width" content="1280"/>
            <meta property="og:image:height" content="640"/>
            <meta property="og:image:alt" content="Jnanin Yoga Studio"/>

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title || (activePage.toCapitalCase() + " - Jnanin Yoga Studio")}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={HostName + image}/>
            <meta name="twitter:image:alt" content="Jnanin Yoga Studio"/>

            {meta.children}
        </Helmet>
    )
}