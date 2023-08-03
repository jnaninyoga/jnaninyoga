import React, { Suspense } from 'react'
import Router from '../router'
import Suspens from '../layouts/Suspens';

export default function Core() {
    return (
        <Suspense fallback={<Suspens/>}>
            <React.StrictMode>
                <Router />
            </React.StrictMode>
        </Suspense>
    )
}