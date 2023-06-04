import { Spinner } from 'flowbite-react';

export const ActiveConversationSkeleton = () => (
    <div className="flex justify-center items-center w-full h-full">
        <Spinner
            aria-label="Extra large spinner example"
            size="xl"
        />
    </div>
)