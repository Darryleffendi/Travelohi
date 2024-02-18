import AdminPage from "../pages/admin/admin-page";
import AiPage from "../pages/ai-page";
import AuthPage from "../pages/auth/auth-page";
import GamePage from "../pages/game/game-page";
import HomePage from "../pages/home/home-page";
import HotelDetails from "../pages/hotel-details";
import ProfilePage from "../pages/profile-page";
import ExplorePage from "../pages/search/explore-page";

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
        name: "Explore",
        subtitle: "Hotels & Flights",
        path: "/explore",
        element: <ExplorePage />
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
    },
    {
        name: "Admin Page",
        path: "/admin",
        element: <AdminPage />,
        hideNavbar: true,
        hideOnNavbar: true,
    },
    {
        name: "Profile Page",
        path: "/profile",
        element: <ProfilePage />,
        hideNavbar: false,
        hideOnNavbar: true,
    },
    {
        name: "Hotel Details",
        path: "/hotel/:id",
        element: <HotelDetails />,
        hideNavbar: false,
        hideOnNavbar: true,
    }
]