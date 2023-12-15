import { Referral } from "@/app/interfaces/conversations";
import Image from "next/image";
import { IconLink } from "../../Icons/IconLink";

export const MessageCampaign = ({ referral }: { referral: Referral }) => {
    return (
        <a
            className="my-4 p-2 bg-teal-200 rounded-md flex items-center gap-4 transition ease-in-out hover:bg-teal-200/75"
            href={referral.source_url ?? ""}
            target="_blank"
        >
            {referral.image_url &&
                <Image
                    src={referral.image_url}
                    width={70}
                    height={70}
                    alt="Imagen de mensaje"
                    className='grayscale rounded-md'
                    loading="lazy"
                    decoding="async"
                />
            }

            <div>
                {referral.headline &&
                    <h3 className="font-semibold text-teal-600 text-sm">{referral.headline}</h3>
                }

                {referral.body &&
                    <p className="text-sm">{referral.body}</p>
                }

                {referral.source_url &&
                    <p className="text-teal-600 text-sm flex gap-1 items-center"><IconLink classes="w-4 h-4" /> Ver campaña</p>
                }
            </div>
        </a>
    )
}