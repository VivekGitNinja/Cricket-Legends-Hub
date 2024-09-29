// Player profiles data
const playerProfiles = {
    sachin: {
        name: "Sachin Tendulkar",
        bio: "Sachin Tendulkar, born on April 24, 1973, in Mumbai, India, is widely regarded as one of the greatest cricketers of all time. Making his debut at just 16 years old, Tendulkar’s career spanned 24 years, during which he set numerous records, including being the highest run-scorer in both Test and One-Day Internationals (ODIs). He was known for his impeccable technique, unparalleled concentration, and a wide array of strokes that entertained fans worldwide. Beyond his batting prowess, Tendulkar is admired for his humility and sportsmanship, earning respect from teammates and opponents alike. His accolades include winning the 2011 ICC Cricket World Cup and receiving the Bharat Ratna, India’s highest civilian award, just hours after winning the World Cup.",
        stats: "Matches: 664 (ODIs), 463 (Tests), 1 (T20Is); Runs: 34,357 (ODIs), 18,426 (Tests), 10,000 (T20Is); 100s: 100 (49 in ODIs, 51 in Tests)",
        image: "https://i.pinimg.com/736x/15/b4/bf/15b4bf2345221fe8eec37f270030fb29.jpg"
    },
    shaheen: {
        name: "Shaheen Afridi",
        bio: "Shaheen Afridi, born on April 6, 2000, in Khyber Agency, Pakistan, is known for his impressive fast bowling and has rapidly become one of the mainstays of Pakistan's bowling attack since his debut in 2018. Afridi made headlines for his ability to swing the ball and his effectiveness in all formats of the game. He played a pivotal role in Pakistan's run to the semi-finals of the 2021 ICC T20 World Cup. Beyond his bowling, Afridi is recognized for his athleticism and fielding skills. His aggressive bowling style and performances in international matches have earned him a fan following, making him one of the brightest young talents in world cricket.",
        stats: "Matches: 100 (ODIs); Wickets: 150; Best Bowling: 6/19; Economy Rate: 5.23; Average: 22.53",
        image: "https://w0.peakpx.com/wallpaper/646/937/HD-wallpaper-shaheen-afridi-america-cricket-india-pakistan-pcb-real-marid-shaheen-afridi-shahid-afridi.jpg"
    },
    warne: {
        name: "Shane Warne",
        bio: "Shane Warne, born on September 13, 1969, in Victoria, Australia, was a legendary leg-spin bowler whose impact on the game of cricket is immeasurable. He is credited with reviving the art of spin bowling and had a unique ability to turn the ball, often leading to stunning dismissals. Warne played a significant role in Australia’s dominance in cricket during the 1990s and early 2000s, capturing the imagination of fans worldwide. With his charismatic personality and on-field theatrics, he became a cricketing icon. Warne's accolades include leading Australia to a World Cup victory in 1999 and holding the record for most Test wickets at the time of his retirement.",
        stats: "Matches: 145 (Tests), 194 (ODIs); Wickets: 708 (Tests), 293 (ODIs); Best Bowling: 8/71; Career Average: 25.41 (Tests)",
        image: "https://www.hotstuffsporting.com.au/images/stories/virtuemart/product/SHANE_WARNE____K_4e6d72da07b25.jpg"
    },
    kohli: {
        name: "Virat Kohli",
        bio: "Virat Kohli, born on November 5, 1988, in Delhi, India, is one of the most prolific batsmen in contemporary cricket and a former captain of the Indian national team. Known for his aggressive batting style and sharp cricketing mind, Kohli has rewritten numerous records since making his international debut in 2008. Under his captaincy, India achieved significant milestones, including a historic Test series win in Australia. His fitness regime and dedication to the sport have set new standards in cricket. Kohli's ability to chase down targets and perform in pressure situations has earned him the nickname 'Chase Master.' He is also recognized for his philanthropic efforts and active engagement in various social causes.",
        stats: "Matches: 100 (Tests), 269 (ODIs), 114 (T20Is); Runs: 12,000+ (ODIs), 8,000+ (Tests), 3,000+ (T20Is); 100s: 70 (ODIs), 28 (Tests), 1 (T20Is)",
        image: "https://m.media-amazon.com/images/I/61U+PYfQZXL._AC_UF1000,1000_QL80_.jpg"
    },
    malinga: {
        name: "Lasith Malinga",
        bio: "Lasith Malinga, born on August 28, 1983, in Galle, Sri Lanka, is renowned for his distinctive bowling action and exceptional ability to bowl yorkers. He has been a cornerstone of Sri Lankan cricket, especially in limited-overs formats. Malinga’s performance in the 2011 ICC Cricket World Cup, where he played a crucial role in leading Sri Lanka to the final, is particularly memorable. Known for his charismatic personality and impactful presence on the field, Malinga has been a game-changer in several matches. After his retirement, he remains involved in cricket as a mentor and coach, inspiring the next generation of bowlers.",
        stats: "Matches: 226 (ODIs), 121 (T20Is); Wickets: 338 (ODIs), 107 (T20Is); Best Bowling: 6/38; Average: 33.41 (ODIs), 19.40 (T20Is)",
        image: "https://pbs.twimg.com/media/E_Uq7CiWQAA6vis.jpg:large"
    },
    ponting: {
        name: "Ricky Ponting",
        bio: "Ricky Ponting, born on December 19, 1974, in Launceston, Australia, is regarded as one of the greatest batsmen and captains in the history of cricket. His leadership was instrumental in Australia’s success during the late 1990s and early 2000s, leading the team to two World Cup victories in 1999 and 2003. Ponting’s aggressive batting style and keen cricketing acumen earned him numerous accolades, including being the highest run-scorer in World Cups. Beyond his on-field success, he is admired for his resilience and ability to bounce back from setbacks. After retiring, Ponting has taken on commentary roles and remains a prominent figure in cricket, sharing his insights and experiences.",
        stats: "Matches: 560 (ODIs), 168 (Tests); Runs: 27,000+ (ODIs), 27,000+ (Tests); 100s: 71 (ODIs), 41 (Tests)",
        image: "https://pbs.twimg.com/media/FkVAt3raMAUOzd3.jpg:large"
    }
};

// Function to show player profile
function showProfile(playerId) {
    const profileContent = document.getElementById('profile-content');
    const player = playerProfiles[playerId];

    if (player) {
        profileContent.innerHTML = `
            <h3>${player.name}</h3>
            <img src="${player.image}" alt="${player.name}" style="width: 200px; height: auto;">
            <p><strong>Biography:</strong> ${player.bio}</p>
            <p><strong>Career Stats:</strong> ${player.stats}</p>
        `;
    } else {
        profileContent.innerHTML = '<p>Player profile not found.</p>';
    }
}

// Function to submit fan story
function submitStory() {
    const storyInput = document.getElementById('fan-story');
    const story = storyInput.value;

    if (story) {
        alert(`Thank you for sharing your story: "${story}"`);
        storyInput.value = ''; // Clear the input field
    } else {
        alert('Please write your story before submitting.');
    }
}