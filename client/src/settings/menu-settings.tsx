import AdminPage from "../pages/admin/admin-page";
import AiPage from "../pages/ai-page";
import AuthPage from "../pages/auth/auth-page";
import ForgetPasswordPage from "../pages/auth/forget-password-page";
import FlightDetails from "../pages/flight-details";
import GamePage from "../pages/game/game-page";
import HomePage from "../pages/home/home-page";
import HotelDetails from "../pages/hotel/hotel-details";
import NotFoundError from "../pages/error/not-found-error";
import ProfilePage from "../pages/profile/profile-page";
import ExplorePage from "../pages/search/explore-page";
import BannedError from "../pages/error/banned-error";

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
        path: "/explore/",
        element: <ExplorePage />,
        // footerColor: "#F1F6F9",
    },
    {
        name: "Explore",
        subtitle: "Hotels & Flights",
        path: "/explore/:params",
        element: <ExplorePage />,
        // footerColor: "#F1F6F9",
       hideOnNavbar: true 
    },
    {
        name: "Explore",
        subtitle: "Hotels & Flights",
        path: "/explore/:params/:page",
        element: <ExplorePage />,
        // footerColor: "#F1F6F9",
       hideOnNavbar: true 
    },
    {
        name: "Entertainment",
        subtitle: "Ease your mind",
        path: "/game",
        element: <GamePage />,
        requireLogin: true,
    },
    {
        name: "Find a Place",
        subtitle: "AI Assistant",
        path: "/ai",
        element: <AiPage />,
        // footerColor: "#394867",
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
        disableNavbarEffect: true,
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
    },
    {
        name: "Forget Password",
        path: "/forget-password",
        element: <ForgetPasswordPage />,
        hideNavbar: true,
        hideOnNavbar: true,
    },
    {
        name: "404Error",
        path: "*",
        element: <NotFoundError />,
        hideNavbar: true,
        hideOnNavbar: true,
    },
    {
        name: "BannedError",
        path: "/banned",
        element: <BannedError />,
        hideNavbar: true,
        hideOnNavbar: true,
    }
]