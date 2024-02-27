import AdminPage from "../pages/admin/admin-page";
import AiPage from "../pages/ai-page";
import AuthPage from "../pages/auth/auth-page";
import FlightDetails from "../pages/flight-details";
import GamePage from "../pages/game/game-page";
import HomePage from "../pages/home/home-page";
import HotelDetails from "../pages/hotel/hotel-details";
import ProfilePage from "../pages/profile-page";
import ExplorePage from "../pages/search/explore-page";

export interface IMenu {
    name                 : string;
    subtitle?            : string;
    path                 : string;
    element              : JSX.Element;
    hideNavbar?          : boolean;
    hideOnNavbar?        : boolean;
    disableNavbarEffect? : boolean;
    requireLogin?        : boolean;
    requireAdmin?        : boolean;
    footerColor?         : string; // If null, then hide footer
}

export const MENU_LIST : IMenu[] = [
    {
        name: "Login",
        path: "/login",
        element: <AuthPage />,
        hideNavbar: true,
        hideOnNavbar: true,
    },
    {
        name: "Homepage",
        subtitle: "TraveloHI",
        path: "/",
        element: <HomePage />,
        footerColor: "#fefefe",
    },
    {
        name: "Explore",
        subtitle: "Hotels & Flights",
        path: "/explore",
        element: <ExplorePage />,
        // footerColor: "#F1F6F9",
    },
    {
        name: "Entertainment",
        subtitle: "Ease your mind",
        path: "/game",
        element: <GamePage />,
        footerColor: "#394867",
        requireLogin: true,
    },
    {
        name: "Find a Place",
        subtitle: "AI Assistant",
        path: "/ai",
        element: <AiPage />,
        footerColor: "#394867",
    },
    {
        name: "Admin Page",
        path: "/admin",
        element: <AdminPage />,
        hideNavbar: true,
        hideOnNavbar: true,
        requireAdmin: true,
    },
    {
        name: "Profile Page",
        path: "/profile",
        element: <ProfilePage />,
        hideOnNavbar: true,
        footerColor: "#F1F6F9",
        requireLogin: true,
    },
    {
        name: "Hotel Details",
        path: "/hotel/:id",
        element: <HotelDetails />,
        hideOnNavbar: true,
        disableNavbarEffect: true,
        footerColor: "#F1F6F9",
    },
    {
        name: "Flight Details",
        path: "/flight/:id",
        element: <FlightDetails />,
        hideOnNavbar: true,
        disableNavbarEffect: true,
    }
]