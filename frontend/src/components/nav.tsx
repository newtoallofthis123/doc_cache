import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input";

export default function Nav({
    auth = false,
    title = 'DocCache',}) {
    return (
        <>
            <nav>
                <div
                    style={{
                        boxShadow: '0 0 2px 2px #797979',
                    }}
                    className="flex flex-row border-2 border-black justify-between items-center p-4"
                >
                    <div className="flex-shrink-0 flex flex-row justify-around">
                        <img
                            width={162}
                            height={162}
                            className="w-10 h-10 md:w-12 md:h-12"
                            src="/favicon.svg"
                            alt="DocCache Logo"
                        />
                        <h1 className="text-3xl font-bold p-1 ml-2">
                            <a href="/">DocCache</a>
                        </h1>
                    </div>
                    <div className="gap-x-10">
                        <ul className="gap-x-8 flex flex-row">
                            {[
                                'about',
                                'dashboard',
                                'records',
                                'archive',
                                'add',
                                'manage',
                            ].map((link) => {
                                return (
                                    <li className="text-lg" key={link}>
                                        <a href={"/" + link}>
                                            {link.slice(0, 1).toUpperCase() +
                                                link.slice(1)}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="border-2 p-1 w-96 border-neutral-400 rounded-3xl drop-shadow-lg">
                        <form onSubmit={
                            (e) => {
                                e.preventDefault();
                                const query = e.currentTarget.query.value;
                                typeof window !== 'undefined' && (
                                    window.location.href = `/search/${query}`
                                )
                            }
                        } className="flex w-full items-center">
                            <Input type="search" name="query" className="border-0 focus-visible:outline-none focus-visible:ring-0" placeholder="Search" />
                            <Button className="bg-inherit border-0 shadow-none text-black text-xl hover:bg-inherit" type="submit">🔍</Button>
                        </form>
                    </div>
                    <div>
                        <Button className="text-xl px-5 py-6">
                            {!auth && <a href="/auth/login">Login</a>}
                            {auth && <a href="/logout">Logout</a>}
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
}
