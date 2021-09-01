module.exports.config = {
	name: 'help',
	version: '1.0.1',
	hasPermssion: 0,
	credits: 'Fuzik',
	description: 'Hướng dẫn cho người mới',
	commandCategory: '1',
	usages: '[tên module]',
	cooldowns: 5
};

module.exports.handleEvent = function({ api, event }) {
	const { commands } = global.client;

	if (!event.body) return;

	const { threadID, messageID, body } = event;

	if (body.indexOf('help') != 0) return;

	const splitBody = body
		.slice(body.indexOf('help'))
		.trim()
		.split(/\s+/);

	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase()))
		return;

	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());

	const prefix = threadSetting.hasOwnProperty('PREFIX')
		? threadSetting.PREFIX
		: global.config.PREFIX;

	return api.sendMessage(
		`\n❯ Modules: ${command.config.name}\n❯ Tính năng: ${
			command.config.description
		}\n❯ Cách sử dụng: ${prefix}${command.config.name} ${
			command.config.usages ? command.config.usages : ''
		}\n❯ Thuộc nhóm: ${command.config.commandCategory}\n❯ Thời gian chờ: ${
			command.config.cooldowns
		} giây(s)\n❯ Quyền hạn: ${
			command.config.hasPermssion == 0
				? 'Người dùng'
				: command.config.hasPermssion == 1
					? 'Quản trị viên'
					: 'Người vận hành'
		}\n\n✦ Modules code by ${command.config.credits}`,
		threadID,
		messageID
	);
};

module.exports.run = function({ api, event, args }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || '').toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};

	if (!command) {
		const command = commands.values();
		var group = [],
			msg = '';
		for (const commandConfig of command) {
			if (
				!group.some(
					item =>
						item.group.toLowerCase() ==
						commandConfig.config.commandCategory.toLowerCase()
				)
			)
				group.push({
					group: commandConfig.config.commandCategory.toLowerCase(),
					cmds: [commandConfig.config.name]
				});
			else
				group
					.find(
						item =>
							item.group.toLowerCase() ==
							commandConfig.config.commandCategory.toLowerCase()
					)
					.cmds.push(commandConfig.config.name);
		}
		group.forEach(
			commandGroup =>
				(msg += `✦ TẤT CẢ CÁC LỆNH ✦\n\n ${commandGroup.cmds.join(
					', '
				)}\n\n`)
		);
		return api.sendMessage(
			msg +
				`✦ CÁCH SỬ DỤNG LỆNH ✦\n\n ${
					threadSetting.hasOwnProperty('PREFIX')
						? threadSetting.PREFIX
						: global.config.PREFIX
				}help từng lệnh ở trên để xem chi tiết cách sử dụng! | Hiện tại đang có ${
					commands.size
				} lệnh có thể sử dụng trên bot này.`,
			threadID
		);
	}

	const prefix = threadSetting.hasOwnProperty('PREFIX')
		? threadSetting.PREFIX
		: global.config.PREFIX;

	return api.sendMessage(
		`\n❯ Modules:  ${command.config.name}\n❯ Tính năng: ${
			command.config.description
		}\n❯ Cách sử dụng: ${prefix}${command.config.name} ${
			command.config.usages ? command.config.usages : ''
		}\n❯ Thuộc nhóm: ${command.config.commandCategory}\n❯ Thời gian chờ: ${
			command.config.cooldowns
		} giây(s)\n❯ Quyền hạn: ${
			command.config.hasPermssion == 0
				? 'Người dùng'
				: command.config.hasPermssion == 1
					? 'Quản trị viên'
					: 'Người vận hành'
		}\n\n✦ Modules code by ${command.config.credits}`,
		threadID,
		messageID
	);
};
