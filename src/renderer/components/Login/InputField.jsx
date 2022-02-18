import React from 'react'

function InputField({
    label,
    placeholder,
    Icon,
    value,
    updatedValue,
    visible,
    setvisible,
}) {
    return (
        <div className='mx-2'>
            <label className="sr-only">{label}</label>
            <div className="relative">
                <input
                    type={visible ? label : "text"}
                    className="w-full p-4 pr-12 text-sm text-primary-text border-2 border-double bg-primary-background rounded-lg shadow-lg "
                    placeholder={placeholder}
                    onChange={(e) => updatedValue(e.target.value)}
                    value={value}

                />
                {
                    Icon && <span className="absolute inset-y-0 inline-flex items-center right-4">
                        <Icon
                            size={25}
                            className='text-primary-text'
                            onClick={() => {
                                visible!=null && setvisible(!visible)
                            }}
                        />
                    </span>
                }
            </div>
        </div>
    )
}

export default InputField
