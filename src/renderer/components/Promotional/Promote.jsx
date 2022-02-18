import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from './Banner';
import Stats from './Stats';
export default function SelfPromotional({
    uname,
    Data,
    composeopen,
    setcomposeopen
}) {

    const [UnreadCount, setUnreadCount] = useState(0);
    const [StarredCount, setStarredCount] = useState(0)
    const location = useLocation();
    useEffect(() => {
        let x = isFlagged('seen')
        setUnreadCount(Data?.length - x)
        let y = isFlagged("flagged")
        setStarredCount(y);
    }, [Data])

    function isFlagged(flag) {
        let count = 0
        if (location.pathname.toLowerCase() != '/') {
            for (let index = 0; index < Data?.length; index++) {
                const element = Data[index];
                let x = []
                element?.flags?.forEach((e) => {
                    x.push(e)
                })
                if (x?.length > 0) {
                    for (let i = 0; i < x.length; i++) {
                        const va = x[i];
                        if (va.toLowerCase().includes(flag)) {
                            count += 1;
                        }
                    }
                }
            }
            return count
        } else {
            for (let index = 0; index < Data?.length; index++) {
                const element = Data[index];
                if (Object.keys(element.flags).length >= 1) {
                    let val = Object.values(element.flags)
                    val.forEach((f) => {
                        if (f.toLowerCase().includes(flag)) {
                            count += 1;
                        }
                    })
                }
            }
            return count;
        }
    }

    return (
        <div className='bg-gradient-to-tr from-positive via-primary-background to-primary h-fit  lg:h-[calc(100vh_-_6rem)] p-4 w-screen '>
            <Stats
                uname={uname}
                Data={Data}
                UnreadCount={UnreadCount}
                StarredCount={StarredCount}
            />
            <div className=''>
                <Banner
                    composeopen={composeopen}
                    setcomposeopen={setcomposeopen}
                />
            </div>
        </div>
    )
}


