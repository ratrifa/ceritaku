import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center">
                <AppLogoIcon className="text-sidebar-foreground size-6 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-[15px]">
                <span className="mb-0.5 truncate leading-none font-semibold">CeritaKu</span>
            </div>
        </>
    );
}
