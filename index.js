const { Client, Events, GatewayIntentBits } = require('discord.js');
const unirest = require('unirest');

console.log("11")

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	await interaction.deferReply();

  
  if (commandName === 'ping') {
    await interaction.editReply({ content: 'Secret Pong!', ephemeral: true });
  }

  if (commandName === 'withiofdefaults') {

    const endpoint = "https://hml-calculus.zipdin.com.br/credit/simulation/with-iof-defaults";
    
    let req = await unirest('POST', endpoint)
      .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.zipdinCalculusJWTToken
      })
      .send(JSON.stringify([
        {
            "issueDate": interaction.options.getString("idt") + "T00:00:00.000Z",
            "firstDueDate": interaction.options.getString("fdt") + "T00:00:00.000Z",
            "installmentsNumber": interaction.options.getInteger("in"),
            "MonthlyRate": interaction.options.getNumber("mr"),
            "loanValue": interaction.options.getNumber("lv"),
            "InstallmentValue": interaction.options.getNumber("iv"),
        }
      ]))
      .end(res => {
        if (res.error) throw new Error(res.error); 
        interaction.editReply({ 
          content: "```json\n" + JSON.stringify(res.body, null, 4) + "\n```", 
          ephemeral: true 
        });
      });

  }

});


// Log in to Discord with your client's token
client.login(process.env.TOKEN);
