'use client';
import { Button, Input, message as antMessage } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	SendOutlined,
	WechatOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { Socket, io } from 'socket.io-client';
import Messages from './components/Messages';
import Status from './components/Status';

export interface IMessage {
	action: string;
	message: string;
	roomId: string;
	sender: string;
	createdAt: Date;
}

export default function ChatRoomEntry() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState<string>(() => {
		if (searchParams.has('email')) {
			return searchParams.get('email') || '';
		}

		return '';
	});
	const [ws, setWs] = useState<Socket | undefined>(undefined);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [message, setMessage] = useState('');
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);

	const enterChat = () => {
		if (!email) {
			return;
		}

		const ws = io('http://localhost:3333');
		setWs(ws);
		ws.on('connect', () => {
			ws.emit('join-room', {
				action: 'join-room',
				message: 'joining room',
				roomId: '123456',
				sender: `${email}`,
				createdAt: Date.now(),
			});

			setMessage('');
			antMessage.success(`Websocket opened!`);
		});

		ws.on('disconnect', () => {
			antMessage.success(`Websocket closed!`);
			setWs(undefined);
		});

		ws.on('receive-msg', (data: IMessage) => {
			setMessagesFnc(data);
		});

		ws.on('error', (error) => {
			antMessage.error(`Websocket error: ${error}`);
		});
	};

	const sendMessage = useCallback(() => {
		if (message && message !== '') {
			const data = {
				action: 'send-message',
				message: message,
				roomId: '123456',
				sender: `${email}`,
				createdAt: Date.now(),
			};

			ws?.emit('send-message', data);
			setMessage('');

			setTimeout(() => {
				ref.current?.scroll({
					top: ref.current.scrollHeight,
					behavior: 'smooth',
				});
			}, 200);
		}
	}, [message, ws, email]);

	const handleLogout = () => {
		ws?.disconnect();
		router.push('/');
	};

	const setMessagesFnc = (value: IMessage) => {
		setMessages((prev) => [
			...prev,
			{ ...value, createdAt: new Date(value.createdAt) },
		]);
	};

	const setCurrentEmail = (text: string) => {
		const url = new URL(window.location.toString());

		setEmail(text);
		url.searchParams.set('email', text);
		window.history.pushState({}, '', url);
	};

	useEffect(() => {
		function keyDownHandler(e: globalThis.KeyboardEvent) {
			if (e.key === 'Enter' && ws) {
				e.preventDefault();
				sendMessage();
			}
		}

		document.addEventListener('keydown', keyDownHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
		};
	}, [sendMessage, ws]);

	return (
		<div className='p-8 h-screen'>
			<header className='flex justify-between'>
				<h1 className=''>RealTimeChat</h1>
				<Status
					status={ws ? 'Você está online' : 'Você está offline'}
					color={ws ? 'green' : 'red'}
				/>
				<Button
					type='primary'
					icon={<LogoutOutlined />}
					onClick={handleLogout}
				>
					Sair
				</Button>
			</header>
			<main className='pt-4 max-w-[40rem] mx-auto h-[90%] mt-[2.5%]'>
				{ws ? (
					<div className='flex flex-col justify-end flex-1 h-full bg-slate-900 rounded-xl p-4'>
						<div
							className='overflow-y-auto '
							ref={ref}
						>
							<Messages
								messages={messages}
								currentUser={email}
							/>
						</div>

						<div className='flex gap-1  '>
							<Input
								size='large'
								placeholder='Escreva sua mensagem'
								onChange={(event) => setMessage(event.target.value)}
								value={message}
							/>
							<Button
								type='primary'
								icon={<SendOutlined />}
								onClick={sendMessage}
								className=' h-full'
							>
								Enviar Mensagem
							</Button>
						</div>
					</div>
				) : (
					<form
						onSubmit={enterChat}
						className='bg-slate-900 space-y-6 text-center px-10 py-6 rounded-md w-fit mx-auto mt-4'
					>
						<label
							htmlFor='email'
							className='text-xl font-medium'
						>
							Informe seu melhor email
						</label>
						<Input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setCurrentEmail(e.target.value)}
							placeholder='Email'
							className='w-fit block mx-auto'
						/>

						<Button
							type='primary'
							htmlType='submit'
							icon={<WechatOutlined />}
						>
							Acessar o bate-papo
						</Button>
					</form>
				)}
			</main>
		</div>
	);
}
