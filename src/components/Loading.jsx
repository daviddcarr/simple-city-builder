import { useProgress } from '@react-three/drei'

export default function Loading() {
    const { progress } = useProgress()

    const calculateDashOffset = (progress) => {
        return (progress / 100) * 289
    }

    return (
        <div className="fixed flex justify-center items-center top-0 left-0 transform w-full h-screen bg-[#62A7FF] text-white text-center">
            <div className="text-center">
                <h2 className='text-white mb-4 text-xl uppercase'>Loading</h2>
                <div className="relative">
                    <svg 
                        width="93" 
                        height="81" 
                        viewBox="0 0 93 81" 
                        version="1.1" 
                        xmlns="http://www.w3.org/2000/svg" 
                        style={{
                            overflow: 'visible',
                            stroke: 'white',
                            strokeWidth: '4px',
                            strokeDasharray: `${calculateDashOffset(progress)} 2000`,
                        }}>
                        <path fill="transparent" d="M29.271,0.5L63.729,0.5C67.3,0.5 70.6,2.405 72.386,5.498C76.804,13.15 85.196,27.687 89.614,35.339C91.4,38.432 91.4,42.242 89.614,45.335C85.196,52.988 76.804,67.524 72.386,75.176C70.6,78.269 67.3,80.174 63.729,80.174L29.271,80.174C25.7,80.174 22.4,78.269 20.614,75.176C16.196,67.524 7.804,52.988 3.386,45.335C1.6,42.242 1.6,38.432 3.386,35.339C7.804,27.687 16.196,13.15 20.614,5.498C22.4,2.405 25.7,0.5 29.271,0.5Z" />
                    </svg>
                    <svg 
                        width="93" 
                        height="81" 
                        viewBox="0 0 93 81" 
                        version="1.1" 
                        xmlns="http://www.w3.org/2000/svg"
                        className='absolute top-0 left-0 opacity-50'
                        style={{
                            overflow: 'visible',
                            stroke: 'white',
                            strokeWidth: '4px',
                        }}>
                        <path fill="transparent" d="M29.271,0.5L63.729,0.5C67.3,0.5 70.6,2.405 72.386,5.498C76.804,13.15 85.196,27.687 89.614,35.339C91.4,38.432 91.4,42.242 89.614,45.335C85.196,52.988 76.804,67.524 72.386,75.176C70.6,78.269 67.3,80.174 63.729,80.174L29.271,80.174C25.7,80.174 22.4,78.269 20.614,75.176C16.196,67.524 7.804,52.988 3.386,45.335C1.6,42.242 1.6,38.432 3.386,35.339C7.804,27.687 16.196,13.15 20.614,5.498C22.4,2.405 25.7,0.5 29.271,0.5Z" />
                    </svg>
                    <span className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-xl">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    )
}