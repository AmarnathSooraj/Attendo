const bcrypt = require('bcryptjs');

async function test() {
    const p1 = "password123";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(p1, salt);
    console.log("hash:", hash);
    
    const isMatch = await bcrypt.compare("password123", hash);
    console.log("match:", isMatch);
}
test();
