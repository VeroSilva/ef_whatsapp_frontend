import { Tabs } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';

export const ConversationEmojis = () => {
    return (
        <div className="flex absolute sm:static left-0 bottom-0 ml-5 sm:ml-0 mb-5 sm:mb-0">
            {/* <Lucide icon="Smile" className="w-full h-full" /> */}

            <Tabs.Group
                aria-label="Tabs with underline"
                style="underline"
            >
                <Tabs.Item
                    active
                    icon={HiUserCircle}
                    title="Profile"
                >
                    <p>
                        This is
                        <span className="font-medium text-gray-800 dark:text-white">
                            Profile associated content
                        </span>
                        .
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                        control the content visibility and styling.
                    </p>
                </Tabs.Item>
                <Tabs.Item
                    icon={MdDashboard}
                    title="Dashboard"
                >
                    <p>
                        This is
                        <span className="font-medium text-gray-800 dark:text-white">
                            Dashboard associated content
                        </span>
                        .
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                        control the content visibility and styling.
                    </p>
                </Tabs.Item>
                <Tabs.Item
                    icon={HiAdjustments}
                    title="Settings"
                >
                    <p>
                        This is
                        <span className="font-medium text-gray-800 dark:text-white">
                            Settings associated content
                        </span>
                        .
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                        control the content visibility and styling.
                    </p>
                </Tabs.Item>
                <Tabs.Item
                    icon={HiClipboardList}
                    title="Contacts"
                >
                    <p>
                        This is
                        <span className="font-medium text-gray-800 dark:text-white">
                            Contacts associated content
                        </span>
                        .
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                        control the content visibility and styling.
                    </p>
                </Tabs.Item>
                <Tabs.Item
                    disabled
                    title="Disabled"
                >
                    <p>
                        Disabled content
                    </p>
                </Tabs.Item>
            </Tabs.Group>
        </div>
    )
}