import { useState, ReactNode } from 'react';
import { IconBall } from '../../Icons/IconBall';
import { IconCar } from '../../Icons/IconCar';
import { IconCup } from '../../Icons/IconCup';
import { IconBear } from '../../Icons/IconBear';
import { IconFlag } from '../../Icons/IconFlag';
import { IconHeart } from '../../Icons/IconHeart';
import { IconLightBulb } from '../../Icons/IconLightBulb';
import { IconSmile } from '../../Icons/IconSmile';
import { activityEmojis, animalsAndNatureEmojis, flagsEmojis, foodAndDrinkEmokis, objectsEmojis, smileysAndPeopleEmojis, symbolsEmojis, travelAndPlacesEmojis } from '@/app/utils/emojis';

type EmojiTabProps = {
    tab: string;
    label: ReactNode;
};

export const EmojiDropdown = ({ setMessageToSend, messageToSend }: { setMessageToSend: Function, messageToSend: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('smileys');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleTabClick = (tab: string) => {
        console.log(tab)
        setSelectedTab(tab);
    };

    const handleAddEmoji = (e: React.MouseEvent<HTMLButtonElement>) => {
        const emoji = e.currentTarget.innerText
        setMessageToSend(messageToSend + emoji)
    }

    const EmojiTab: React.FC<EmojiTabProps> = ({ tab, label }) => (
        <button
            className={`${selectedTab === tab ? ' border-b-2 border-teal-600 text-teal-600' : ''
                } px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none`}
            onClick={() => handleTabClick(tab)}
        >
            {label}
        </button>
    );

    return (
        <div className="relative inline-block">
            <button
                className="focus:outline-none me-2"
                onClick={toggleDropdown}
            >
                <IconSmile classes='w-9 h-9 text-teal-600' />
            </button>
            {isOpen && (
                <div className="absolute bottom-0 left-0 mb-16 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <div className="flex">
                        <EmojiTab tab="smileys" label={<IconSmile classes='w-7 h-7' />} /> {/*Smileys and People*/}
                        <EmojiTab tab="animals" label={<IconBear classes='w-7 h-7' />} /> {/*Animals and Nature*/}
                        <EmojiTab tab="food" label={<IconCup classes='w-8 h-8' />} /> {/*Food and Drink*/}
                        <EmojiTab tab="activity" label={<IconBall classes='w-6 h-6' />} /> {/*Activity*/}
                        <EmojiTab tab="travel" label={<IconCar classes='w-7 h-7' />} /> {/*Travel and Places*/}
                        <EmojiTab tab="objects" label={<IconLightBulb classes='w-6 h-6' />} /> {/*Objetcs*/}
                        <EmojiTab tab="symbols" label={<IconHeart classes='w-7 h-7' />} /> {/*Symbols*/}
                        <EmojiTab tab="flags" label={<IconFlag classes='w-7 h-7' />} /> {/*Flags*/}
                    </div>
                    {/* Aquí puedes agregar el contenido de cada tab */}
                    {/* Por ejemplo, para el tab de smileys: */}
                    {selectedTab === 'smileys' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {smileysAndPeopleEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'animals' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {animalsAndNatureEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'food' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {foodAndDrinkEmokis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'activity' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {activityEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'travel' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {travelAndPlacesEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'objects' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {objectsEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'symbols' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {symbolsEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'flags' && (
                        <div className="h-[250px] pb-10 overflow-y-auto scrollbar-hidden mt-2">
                            <div className="grid grid-cols-8 text-2xl">
                                {flagsEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                                        onClick={(e) => handleAddEmoji(e)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
