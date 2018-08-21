const { RichEmbed } = require('discord.js');

module.exports = async (message, invitationMessage, filter, collectorOptions, onCollect, onEnd, reactions = []) => {
	let msg = await message.channel.send(invitationMessage);
	for (let i = 0; i < reactions.length; i++)
		await msg.react(reactions[i]);

	let playersEmbed = new RichEmbed().setTitle('Players');
	let playersMsg = await message.channel.send({embed: playersEmbed});

	const collector = msg.createReactionCollector(filter, collectorOptions);
	collector.on('collect', (r, c) => {
		let playerIDs = r.users.keyArray().filter(id => !global.bot.users.get(id).bot);
		playersEmbed.setDescription(playerIDs.map(id => message.guild.members.get(id)).join('\n'));
		playersMsg.edit({embed: playersEmbed});
		onCollect(r, c, playerIDs).catch(global.logger.error);
	});
	collector.on('end', (collected, reason) => {
		try {
			onEnd(collected, reason);
		} catch (e) {
			global.logger.error(e);
		}
	});
};