import React, { Suspense } from 'react'
import Router from '../router'
import Suspens from '../layouts/Suspens';

export default function Core() {
    return (
        <React.StrictMode>
            <Suspense fallback={<Suspens/>}>
              <Router />
            </Suspense>
        </React.StrictMode>
    )
}