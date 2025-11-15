import {JSX} from "react";
import Link from "next/link";
import Image from "next/image";
import {events} from "@/lib/constant";


interface Props {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string; // ISO 8601 so it can be parsed/sorted easily
    startTime: string;
    endTime: string;
    price: string;
    type: 'Conference' | 'Hackathon' | 'Meetup';
    image: string; // path under public/
    url: string;
 }
function EventCard({title, image,location,date,startTime,endTime,type}: Props): JSX.Element {
    return (
        <Link href={'/events'} id={'event-card'}>
            <Image src={image} alt={title} width={410} height={300} className={'poster'}/>
          <div className={'flex flex-row gap-2'}>
              <Image src={'/icons/pin.svg'} alt={'location'} width={14} height={14}/>
              <p>{location}</p>
          </div>
            <p className={'title'}>{title}</p>
            <div className={'datetime'}>
                <div className={''}>
                    <Image src={'/icons/calendar.svg'} alt={'date'} width={14} height={14}/>
                    <p>{date}</p>
                </div>
                <div>
                    <Image src={'/icons/clock.svg'} alt={'time'} width={14} height={14}/>
                    <p>{startTime}</p>
                </div>
            </div>

        </Link>
    )
}

export default EventCard
