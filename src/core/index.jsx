import React, { Suspense } from 'react'
import Router from '../router'
import Suspens from '../layouts/global/Suspens';
import { HelmetProvider } from 'react-helmet-async'

export default function Core() {
    return (
        <HelmetProvider>
            <Suspense fallback={<Suspens/>}>
                <React.StrictMode>
                    <Router />
                </React.StrictMode>
            </Suspense>
        </HelmetProvider>
    )
}