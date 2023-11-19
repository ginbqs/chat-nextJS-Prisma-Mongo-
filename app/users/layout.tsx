import Sidebar from '../components/sidebar/Sidebar'

export default async function UsersLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Sidebar>
            <div className="h-full">
                <main className='lg:pl20 h-full'>
                    {children}
                </main>
            </div>
        </Sidebar>
    )
}