import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const SocialAuthForm = () => {
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
        <Button className='bg-red-600 text-light px-2 py-5'>
            <Image
            src="/icons/apple.svg"
            height={20}
            width={20}
            alt='apple logo'
            className='invert-colors mr-2 object-contain'
            />
            <span>Log in With Apple</span>
        </Button>
        <Button className='bg-white gap-2 px-2 py-5'>
            <Image
            src="/icons/google.svg"
            height={20}
            width={20}
            alt='google logo'
            className='invert-colors mr-2.5 object-contain'
            />
            <span>Log in With Apple</span>
        </Button>
        <Button className='bg-white gap-2 px-2 py-5'>
            <Image
            src="/icons/github.png"
            height={20}
            width={20}
            alt='githublogo'
            className='invert-colors mr-2.5 object-contain'
            />
            <span>Log in With Apple</span>
        </Button>
    </div>
  )
}

export default SocialAuthForm