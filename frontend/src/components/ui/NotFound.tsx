interface NotFoundProps {
    icon: React.ReactNode
    title: string
    message: string
}

export const NotFound = ({ icon, title, message }: NotFoundProps) => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
            <div className='text-center space-y-8'>
                <div className='text-9xl'>{icon}</div>
                <div>
                    <h2 className='text-4xl font-bold mb-4'>{title}</h2>
                    <p className='text-muted-foreground text-xl'>{message}</p>
                </div>
            </div>
        </div>
    )
}