
export default function TrollerIntro({closeRead}) {
    return (
        <div className="flex flex-col justify-start items-start bg-white rounded-lg shadow-md p-5">
            <h1 className="text-2xl font-extrabold">WELCOME TO TROLLER DERBY</h1>
            <h2 className="text-xl mt-4 font-extrabold">What is Troller Derby?</h2>
            <p className="text-lg mt-2">TROLLer Derby is a variation of flat track roller derby in which fans pay to change the rules (trolling
                the skaters and officials!) Trolls differ from Troller Derby to Troller Derby, invented by the Teams and
                reviewed and approved by the Coaches and Staff. Favorites include things like swapping jammers with referees,
                replacing blockers with giant inflatable pool toys, changing the scores, or making jammers dance to score.
            </p>
            <p className="text-lg mt-2">Our "Trolls" are divided into three categories: Friendship, Laughs, and Advantages.</p>
            <p className="text-lg mt-2"><span className="font-extrabold">Friendship Trolls</span> are kindly donations to our Troller Derby and the teams participating. Friendship Troll
            donations will be announced with the Jam and displayed during the game.</p>
            <p className="text-lg mt-2"><span className="font-extrabold">Laugh Trolls</span> are funny effects that are generally hilarious. They can affect everyone or be applied
            to one team. You can buy them at any time and they will happen during gameplay or for a specific jam</p>
            <p className="text-lg mt-2"><span className="font-extrabold">Advantage Trolls</span> are applied to only one team, you choose. These are trolls typically improve (or worsen)
            the rules, points, or game outcome for the team selected. You can buy them at any time and they will be used for one Jam.</p>
            <p className="text-lg mt-2">Troller Derby is a fun way to raise funds for our Derby League. All trolls purchased are tax-deductible donations. If you
            provide your email, we will send you a receipt with all of your Troll Donations!</p>
            <h2 className="text-xl mt-2 font-extrabold">How Do I Participate?</h2>
            <p className="text-lg mt-2">Once you click the "Done" button below, you'll be taken to a screen with a Menu of all our Troll Options.
                You simply select the one you want by tapping it. If you can buy multiples of the Troll, plus and minus buttons will
                be available and you can increase the number of times you'd like your troll to be used.</p>
            <p className="text-lg mt-2">If your troll requires selecting a team, the team choices will be shown and you should pick one by tapping it.</p>
            <p className="text-lg mt-2">If your troll requires selecting a player or referee, the player choices will be in a dropdown and you should pick one.</p>
            <p className="text-lg mt-2">If you troll requires providing a name, a text box will apepar and let you fill in the choice</p>
            <p className="text-lg mt-2">If this is the first troll your buying, please provide your email so we can send you a receipt for your donation,
                and provide a "Troller Name" that we can show to everyone with your troll. Feel free to make a name up, use your derby name,
                or use your real name, then click the Register Button. You'll only have to do this once, and if you prefer not to share,
                just put a space or an x in the email box and we'll know not to email you.</p>
            <p className="text-lg mt-2">Finally, you can click the "Buy This Troll" button. This will open Venmo (if you have if), for the price of your troll and our
            Crescent City Crushers venmo accout. The Note contains what the troll is and a reference number for us to help keep track of
            trolls and donations.</p>
            <p className="text-lg mt-2"><span className="font-extrabold">YOU DO NOT HAVE VENMO:</span> This is not a problem. Simply choose to pay with Cash, and then come pay us at the Cashier table
            at the event.</p>
            <p className="text-xl mt-5">THANKS FOR COMING! WE HOPE YOU HAVE A GREAT TIME!</p>
            <div className="w-full flex flex-row justify-center items-center">
                <button className="border bg-amber-200 text-xl h-[40px] w-[200px] mt-3" onClick={()=>{ localStorage.setItem("trollReadIntro", true); closeRead(true)}}>Done</button>
            </div>
        </div>
    )
}