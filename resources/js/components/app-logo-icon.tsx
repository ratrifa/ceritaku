import { SVGProps } from 'react';

export default function AppLogoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M24 10.5C20.5 7.9 16.2 6.5 11.5 6.5C8.7 6.5 6.1 7 3.8 8V35.8C6 34.9 8.6 34.5 11.5 34.5C16.4 34.5 20.8 35.9 24 38.5V10.5Z"
                fill="currentColor"
            />
            <path
                d="M24 10.5C27.5 7.9 31.8 6.5 36.5 6.5C39.3 6.5 41.9 7 44.2 8V35.8C42 34.9 39.4 34.5 36.5 34.5C31.6 34.5 27.2 35.9 24 38.5V10.5Z"
                fill="currentColor"
            />
            <path
                d="M28.4 18.6L34.8 12.2C35.3 11.7 36.1 11.7 36.6 12.2L39.2 14.8C39.7 15.3 39.7 16.1 39.2 16.6L32.8 23L28.4 24.1L29.5 19.7L28.4 18.6Z"
                fill="currentColor"
            />
        </svg>
    );
}
