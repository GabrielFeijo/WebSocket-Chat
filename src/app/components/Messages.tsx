import { Comment } from '@ant-design/compatible';
import { Avatar, Empty } from 'antd/lib';
import { IMessage } from '../page';
import { formatDateTime } from '../utils/formatDateTime';

interface IMessageProps {
	messages?: IMessage[];
	currentUser?: string;
}

const Messages = ({ messages, currentUser }: IMessageProps) => {
	return (
		<>
			{messages && messages?.length > 0 ? (
				<div className='space-y-4 m-4 '>
					{messages.map((message, idx) => (
						<>
							{message.sender === currentUser ? (
								<>
									<div
										key={idx}
										className='flex flex-col items-end gap-2'
									>
										<p className='rounded p-3 bg-[#108ee9] text-right break-words max-w-full'>
											{message.message}
											<span className='text-[12px] block text-white/60'>
												{formatDateTime(message.createdAt)}
											</span>
										</p>
									</div>
								</>
							) : (
								<Comment
									key={idx}
									author={<a>{message.sender?.split('@')[0]}</a>}
									avatar={
										<Avatar
											alt={message.sender}
											style={{ backgroundColor: '#f56a00' }}
										>
											{message.sender?.split('')?.[0].toUpperCase()}
										</Avatar>
									}
									content={
										<p>
											{message.message}
											<span className='text-[12px] block text-black/60 text-right'>
												{formatDateTime(message.createdAt)}
											</span>
										</p>
									}
									className='w-fit rounded px-3'
								/>
							)}
						</>
					))}
				</div>
			) : (
				<div className='my-4'>
					<Empty
						description={
							<span className='text-white'>Nenhuma mensagem recebida :(</span>
						}
					/>
				</div>
			)}
		</>
	);
};

export default Messages;
