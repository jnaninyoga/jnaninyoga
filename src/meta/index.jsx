// using Helmet to setupe mata data for each page
import { Helmet } from 'react-helmet'
import { activePage, currentLanguage } from '../utils';
import PropType from 'prop-types';
import { HostName } from '../constant/ogp';

Meta.propTypes = {
    meta: PropType.shape({
        title: PropType.string,
        description: PropType.string.isRequired,
        keywords: PropType.string.isRequired,
        ogp: PropType.shape({
            image: PropType.string.isRequired,
            imageAlt: PropType.string,
            url: PropType.string,
            type: PropType.oneOf(["article", "blog", "website"])
        }).isRequired,
        children: PropType.node
    })
}

export default function Meta(meta) {
    const {title, description, keywords, ogp} = meta;
    const {image, url, type = "website"} = ogp;

    return (
        <Helmet>
            <meta charSet="utf-8"/>
            <title>{title || (activePage().toCapitalCase() + " - Jnanin Yoga Studio")}</title>
            <meta lang={currentLanguage().code} name="description" content={description}/>
            <meta lang={currentLanguage().code} name="keywords" content={keywords}/>
            {/* OGP - Open Graph Protocol */}
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:type" content={type}/> {/* article, blog, website */}
            <meta property="og:url" content={url || HostName + (window.location.pathname + window.location.search)}/>
            <meta property="og:image" content={image}/>
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={HostName + image}/>
            <meta name="twitter:image:alt" content={title}/>
            {/* Canonical */}
            <link rel="canonical" href="https://jnaninyoga.com/"/>

            {meta.children}
        </Helmet>
    )
}

