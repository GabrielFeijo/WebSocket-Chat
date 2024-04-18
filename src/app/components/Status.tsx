interface IStatus {
	status?: string;
	color?: string;
}

const Status = ({ status, color }: IStatus) => {
	return (
		<span className='flex flex-row items-center gap-2'>
			<span
				className={`w-3 h-3 rounded-full`}
				style={{ backgroundColor: color }}
			></span>
			<span>{status}</span>
		</span>
	);
};

export default Status;
