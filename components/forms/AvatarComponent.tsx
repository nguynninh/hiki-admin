"use client";

const AvatarComponent = ({
    image,
    name,
    email,
}: {
    image: string;
    name: string;
    email: string;
}) => {
    return (
        <div className="flex items-center gap-3">
            <img
                src={image}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
                <p className="font-semibold text-sm text-gray-900">{name}</p>
                <a href={`mailto:${email}`} className="text-xs text-gray-500">{email}</a>
            </div>
        </div>
    );
};

export default AvatarComponent;