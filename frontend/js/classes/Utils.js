class Utils {
    static getRandomColor = () => {
        const colors = [
            'cadetblue',
            'darkgoldenrod',
            'cornflowerblue',
            'darkkhaki',
            'hotpink',
            'darkorchid',  
            'gold'
        ]

        const randomIndex = Math.floor(Math.random() * colors.length)
        return colors[randomIndex]
    }

    static scrollScreen = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };
}

export default Utils;
