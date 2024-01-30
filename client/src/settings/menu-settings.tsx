import AiPage from "../pages/ai-page";
import AuthPage from "../pages/auth/auth-page";
import GamePage from "../pages/game/game-page";
import HomePage from "../pages/home-page";

export interface IMenu {
    name: string;
    subtitle?: string;
    path: string;
    element: JSX.Element;
    hideNavbar? : boolean;
    hideOnNavbar? : boolean;
}

export const MENU_LIST : IMenu[] = [
    {
        name: "Login",
        path: "/login",
        element: <AuthPage />,
        hideNavbar: true,
        hideOnNavbar: true
    },
    {
        name: "Homepage",
        subtitle: "TraveloHI",
        path: "/",
        element: <HomePage />
    },
    {
        name: "Our Hotels",
        subtitle: "Book now",
        path: "/",
        element: <HomePage />
    },
    {
        name: "Our Flights",
        subtitle: "Seats Available",
        path: "/",
        element: <HomePage />
    },
    {
        name: "Entertainment",
        subtitle: "Ease your mind",
        path: "/game",
        element: <GamePage />
    },
    {
        name: "Find a Place",
        subtitle: "AI Assistant",
        path: "/ai",
        element: <AiPage />
    }
]