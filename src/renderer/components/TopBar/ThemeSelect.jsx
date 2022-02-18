import React, { useState, useEffect } from 'react'
import { MdArrowDropDown, MdCheck } from 'react-icons/md'
import { ListOfThemes } from '../../themes'

function ThemeSelect({
    selected,
    setselected,
    toggle,
    settoggle
}) {

    const [changedval, setchangedval] = useState(selected)

    useEffect(() => {
        setchangedval(selected)
    }, [selected])


    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    onClick={() => settoggle(!toggle)}
                    type="button" className="inline-flex justify-center w-full  bg-gradient-to-tl from-primary-background to-primary rounded-tl-2xl rounded-br-2xl  shadow-lg px-4 py-2  text-sm   font-bold " id="menu-button" aria-expanded="true" aria-haspopup="true">
                    {selected}
                    <MdArrowDropDown className="-mr-1 ml-2 h-5 w-5" />
                </button>
            </div>
            {toggle && <div className="origin-top-right absolute right-0 mt-2  px-5    rounded-md shadow-lg bg-primary-background  ring-opacity-5  " role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                {ListOfThemes.map((theme) => {
                    return (
                        <div className="flex items-center cursor-pointer my-2 " role="none">
                            {changedval != theme?.label ? (<div
                                className=' p-1 h-2 w-2  rounded-full'
                                style={{
                                    backgroundColor: theme.primary,
                                }}
                            />) : (
                                <MdCheck size={18} />
                            )}
                            <div onClick={() => setselected(theme.label)} className="text-gray-700 block px-4 py-2 text-sm no-underline p-2" >{theme.label}</div>
                        </div>
                    )
                }
                )}
            </div>}
        </div>
    )
}

export default ThemeSelect
