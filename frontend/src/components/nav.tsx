import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input";

export default function Nav({
    auth = false}) {
    return (
        <>
            <nav>
                <div
                    style={{
                        boxShadow: '0 0 2px 2px #797979',
                    }}
                    className="flex flex-row justify-between items-center p-3"
                >
                    <div className="flex-shrink-0 flex flex-row justify-around">
                        <img
                            width={96}
                            height={96}
                            className="w-10 h-10 md:w-10 md:h-10"
                            src="/favicon.svg"
                            alt="DocCache Logo"
                        />
                        <h1 className="text-2xl font-bold p-1 ml-2">
                            {!auth && <a href="/">DocCache</a>}
                            {auth && <a href="/dashboard">DocCache</a>}
                        </h1>
                    </div>
                    <div className="gap-x-10">
                        <ul className="gap-x-8 flex flex-row">
                            {[
                                'doctors',
                                'dashboard',
                                'payments',
                                'archive',
                                'add',
                                'today',
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
                    <div className="border-2 w-96 border-neutral-400 rounded-3xl drop-shadow-lg">
                        <form onSubmit={
                            (e) => {
                                e.preventDefault();
                                const query = e.currentTarget.query.value;
                                typeof window !== 'undefined' && (
                                    window.location.href = `/search/${query}`
                                )
                            }
                        } className="flex w-full items-center">
                            <Input type="search" autoComplete="off" spellCheck='false' name="query" className="border-0 focus-visible:outline-none focus-visible:ring-0" placeholder="Search" />
                            <Button className="bg-inherit border-0 shadow-none text-black text-xl hover:bg-inherit" type="submit">🔍</Button>
                        </form>
                    </div>
                    <div>
                        <Button className="text-lg px-2 py-5">
                            {!auth && <a href="/auth">Login</a>}
                            {auth && <a href="/logout">Logout</a>}
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
}
