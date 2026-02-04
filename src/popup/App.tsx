import { Suspense } from 'react';

import { RouterProvider, createRouter } from '@tanstack/react-router';

import PopupHeader from '@/popup/modules/core/components/PopupHeader/PopupHeader';

import { routeTree } from './routeTree.gen';

const router = createRouter({
    routeTree: routeTree
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return (
        <Suspense fallback={<PopupHeader />}>
            <RouterProvider router={router} />
        </Suspense>
    );
}
