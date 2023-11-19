
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { BsGithub, BsGoogle, BsFacebook } from 'react-icons/bs'
import { toast } from 'react-hot-toast'

import Input from '@/app/components/inputs/input';
import Button from '@/app/components/Button';
import AuthSocialButton from './AuthSocialButton';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
type Variant = 'LOGIN' | 'REGISTER'


const AuthForm = () => {
	const session = useSession()
	const router = useRouter()
	const [variant, setVariant] = useState<Variant>('LOGIN');
	const [isLoading, setIsloading] = useState<boolean>(false)
	const toogleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER')
		} else {
			setVariant('LOGIN')
		}
	}, [variant]);

	useEffect(() => {
		if (session?.status === 'authenticated') {
			console.log('authenticate')
			router.push('/users')
		}
	}, [session?.status])

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsloading(true)
		if (variant === 'REGISTER') {
			axios.post('/api/register', data)
				.then(() => signIn('credentials', data))
				.catch(() => toast.error(`something went wrong`))
				.finally(() => setIsloading(false))
		}

		if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false
			})
				.then((callback) => {
					if (callback?.error) {
						toast.error(`invalid credential`)
					}
					if (callback?.ok) {
						toast.success(`success`)
					}
				})
				.finally(() => {
					setIsloading(false)
				})
		}
	}
	type socialtype = 'github' | 'facebook' | 'google'
	const socialAction = (action: socialtype) => {
		setIsloading(true)
		signIn(action, { redirect: false })
			.then((callback) => {
				if (callback?.error) {
					toast.error(`invalid credential`)
				}
				if (callback?.ok) {
					toast.success(`success`)
				}
			})
			.finally(() => setIsloading(false))
	}

	const {
		register,
		handleSubmit,
		formState: {
			errors
		}
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})


	return (
		<div
			className='
				mt-8
				sm:mx-auto
				sm:w-full
				sm:max-w-md
			'
		>
			<div className='
				bg-gray-100
				px-4
				py-8
				shadow
				sm:rounded-lg
				sm:px-10
			'>
				<form
					className='space-y-6'
					onSubmit={handleSubmit(onSubmit)}
				>
					{
						variant === 'REGISTER' && (
							<Input
								id='name'
								label='Name'
								register={register}
								errors={errors}
								disabled={isLoading}
							/>
						)
					}
					<Input
						id='email'
						label='Email Address'
						type='email'
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Input
						id='password'
						label='Password'
						type='password'
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<div>
						<Button
							disabled={isLoading}
							fullWidth
							type='submit'
						>
							{variant === 'LOGIN' ? 'Sign In' : 'Sign Up'}
						</Button>
					</div>
				</form>
				<div className='mt-6'>
					<div className='relative'>
						<div className='
							absolute
							inset-0
							flex
							items-center
						'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='bg-gray-100 px-2 text-gray-500'>
								Or continue with
							</span>
						</div>
					</div>
					<div className='mt-6 flex gap-2'>
						<AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
						<AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
						<AuthSocialButton icon={BsFacebook} onClick={() => socialAction('facebook')} />
					</div>
				</div>
				<div className='
					flex
					gap-2
					justify-center
					text-sm
					mt-6
					text-gray-500
				'>
					<div> {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}</div>
					<div onClick={() => toogleVariant()} className='underline cursor-pointer'>
						{variant === 'LOGIN' ? 'Create an Account' : 'Login'}
					</div>
				</div>
			</div>

		</div>
	)
}

export default AuthForm;