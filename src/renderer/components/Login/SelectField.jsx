import React from 'react'
import { ManualSetup } from '~/components/Login/ManualSetup'

function SelectField({
    selected
}) {
    return (
        <div>
            {ManualSetup && ManualSetup.map((config, index) => (
                <div key={index} className=' grid grid-cols-2 p-2  my-1 '>
                    <span
                        className=''
                    >{config.label}</span>
                    {<select className=" bg-primary-background "
                        onChange={(e) => {
                            if (e.target.value.toLowerCase().includes("com")) {
                                selected.host = e.target.value
                            } else {
                                if (e.target.value.toLowerCase().includes("tls")) {
                                    selected.secure = true
                                } else {
                                    selected.secure = false
                                }
                            }
                        }}
                    >
                        {config.options?.map((optionval, i) => (
                            <option key={i}  className='border-2' value={!optionval?.host ? optionval : optionval?.host}>
                                {!optionval?.host ? optionval : optionval?.host}
                            </option>
                        ))}
                    </select>
                    }

                </div>
            ))}
        </div>
    )
}

export default SelectField
