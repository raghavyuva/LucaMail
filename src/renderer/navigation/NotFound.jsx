import React from 'react'
import { Link } from 'react-router-dom'
function NotFound() {
    return (
        <div>
            <section className="flex  items-center  p-16 bg-coolGray-50 text-coolGray-800 h-screen">
                <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 font-extrabold text-9xl text-coolGray-400">
                            <span className="sr-only">Error</span>404
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
                        <p className="mt-4 mb-8 text-coolGray-600">But dont worry, you can find plenty of other things on our homepage.</p>
                        <Link to='/' className="px-8 py-3 font-semibold rounded bg-violet-600 text-coolGray-50">
                            <div className="px-8 py-3 font-semibold rounded bg-green-600 text-black">
                            Back to homepage
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NotFound
