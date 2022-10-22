'use strict';
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRow, Collection } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('menu')
		.setDescription('Сreates info menu.')
		.setDMPermission(false)
		.addBooleanOption(option =>
			option.setName('resend').setDescription('Resend menu message \ connect to existing one').setRequired(true)),
	async execute(interaction) {

		await interaction.deferReply().then(async () => {
			await interaction.deleteReply().then(async () => {
				if (interaction.options.getBoolean('resend')) await interaction.channel.send(menu.mainMessage);
			});
		});

    const filter = (i) => {return ((i.message.createdAt - Date.now()) < 86400)}
		const menuCollector = interaction.channel.createMessageComponentCollector(interaction.client, { filter: filter, componentType: ActionRow });
		menuCollector.on('end', collected => console.log(`Collected ${collected.size} items`));
		menuCollector.on('collect', async i => {
			(menu.interActions[i.customId]) ? (menu.interActions[i.customId](i)) :
				(i.isRepliable()) ? await i.reply(menu[i.customId]) : await i.followUp(menu[i.customId]);
		});
	},
};

const menu = {};

menu.interActions = {
	backToRoles: (i) => { return i.update(menu.roles); },
	district: (i) => { return i.update(menu.roles.district); },
	feedback: (i) => { return i.showModal(menu.feedback.modal); },
	events: (i) => {
    let message = { embeds: [new EmbedBuilder().setTitle('Твои роли были изменены:').setColor(0x2F3136)], ephemeral: true, }
    if (i.member.roles.cache.has('1033325356964380672')) {
        message.embeds[0].setDescription(`**-** <@&1033325356964380672>`)
        i.member.roles.remove('1033325356964380672').then(() => {return i.reply(message)})
    } else {
        message.embeds[0].setDescription(`**+** <@&1033325356964380672>`)
        i.member.roles.add('1033325356964380672').then(() => {return i.reply(message)})
    }},
	selectDistrict: async (i) => {
    const roles = (await i.member.fetch()).roles.cache
    const role = i.values[0]
    let desc;
    if (roles.has(role)) {
			await i.member.roles.remove(role);
			desc = `**-** <@&${role}>\n`;
		} else {
			await i.member.roles.add(role);
			desc = `**+** <@&${role}>\n`;
		}
		desc ||= 'Ошибка, изменений не произошло.';
		return i.reply({ embeds: [new EmbedBuilder().setTitle('Твои роли были изменены:').setColor(0x2F3136).setDescription(desc)], ephemeral: true, });
	},
};

menu.mainMessage = {
	embeds: [new EmbedBuilder().setTitle('<a:_:1032911337543700560> Добро пожаловать в Self Improvement Russia!').setColor(0x2F3136)
		.setThumbnail('https://cdn.discordapp.com/icons/999969234425761913/0ad835fb41365c7e01376ff1f0b13837.png?size=4096')
		.setDescription('Мы стремимся объединить участников движения саморазвития в России, **чтобы помочь и поддержать рост друг друга**, независимо от того, ' +
			'на каком этапе своего пути вы находитесь. :compass:\n\nМы предлагаем несколько фантастических возможностей для того, чтобы вы могли делиться идеями, ' +
			'обмениваться советами, слушать информативные мероприятия, получать обратную связь, оставаться подотчетными и **создавать значимую жизнь для себя и других**. ' +
			':muscle_tone1:\n\nНаши интерактивные кнопки, расположенные под этим сообщением, позволят вам ознакомиться с нашими правилами, ' +
			'получить краткое руководство по нашему сообществу, настроить свои роли и получить доступ к новым чатам, отправить нам отзыв, а также получить доступ к нашей **обширной и постоянно растущей библиотеке знаний в Notion!** ' +
			'Приятного вам пребывания, и не забудьте поздороваться с нами в <#1031026435743289418>\n\n\n')
		.setFooter({ text: 'Перманентная ссылка на сервер: https://discord.gg/wJkwr4PR' })],
	components: [new ActionRowBuilder().addComponents([
		new ButtonBuilder().setLabel('Правила').setCustomId('rules').setStyle(ButtonStyle.Success).setEmoji('<:rules:1032985028206002247>'),
		new ButtonBuilder().setLabel('Гайд').setCustomId('guide').setStyle(ButtonStyle.Primary).setEmoji('<:guide:1032985024540188712>'),
		new ButtonBuilder().setLabel('Роли').setCustomId('roles').setStyle(ButtonStyle.Primary).setEmoji('<:roles:1032985003967131718>'),
		new ButtonBuilder().setLabel('Отзывы').setCustomId('feedback').setStyle(ButtonStyle.Secondary).setEmoji('<:feedback:1032985026377285703>'),
		new ButtonBuilder().setLabel('Notion').setStyle(ButtonStyle.Link).setEmoji('<:notion:1032970089135345705>').setURL('https://vladimirgertsen.notion.site/Self-Improvement-Russia-3f7ad96daafc4a9e9ddac450889b0073')])],
};

menu.rules = {
  ephemeral: true,
	embeds: [new EmbedBuilder().setTitle('ПРАВИЛА').setColor(0x2F3136)
		.setDescription('**Будь уважительным.**\nНа сервере категорически запрещены домогательства, преследования, сексизм, расизм, национализм и разжигание ненависти. ' +
			'Запрещается публиковать непристойные, шокирующие материалы, а также контент с ограничениями по возрасту. ' +
			'Запрещается рассылать спам или заниматься самопродвижением (приглашения на сервер, реклама и т. д.) без разрешения одного из администраторов (это правило также распространяется на личные сообщения участникам сервера).\n\n' +
			'**Будь сознательным.**\nСтарайся держать сообщения в каналах, соответствующих их теме (иными словами - избегай оффтоп). ' +
			'Не оскорбляй людей за то, что они играют в видеоигры или поддаются плохим привычкам; это их путь, не Ваш.\n\n' +
			'И, самое главное - **пользуйся здравым смыслом.**\n\n' +
			'Тяжесть наказания выбирается по усмотрению модератора.\n' +
			'Если ты чувствуешь себя незащищенным, пиши модератору.\n' +
			'Если какие-либо из правил несправедливы или мы что-либо упустили, зови <@&1031026434887667731>. Наша задача – помочь всем на пути саморазвития и создать для этого благоприятную обстановку на сервере')],
};

menu.guide = {
  ephemeral: true,
	embeds: [new EmbedBuilder().setTitle('ГАЙД').setColor(0x2F3136)
		.setDescription('Скоро')],
};

menu.roles = {
  ephemeral: true,
	embeds: [new EmbedBuilder().setTitle('РОЛИ').setColor(0x2F3136)
		.setDescription('Скоро')],
	components: [new ActionRowBuilder().addComponents([
		new ButtonBuilder().setLabel('Округ').setCustomId('district').setStyle(ButtonStyle.Primary).setEmoji('🗺️'),
		new ButtonBuilder().setLabel('События').setCustomId('events').setStyle(ButtonStyle.Primary).setEmoji('⏳')])],
};

menu.roles.districts = new Collection([
	['central', '1031026434870878227'],
	['northwestern', '1031026434870878226'],
	['southern', '1031026434870878225'],
	['volga', '1031026434870878224'],
	['ural', '1031026434870878223'],
	['siberian', '1031026434870878222'],
	['farEastern', '1031026434870878221'],
	['northCaucasian', '1031026434870878220']]);


menu.roles.district = {
  ephemeral: true,
	embeds: [new EmbedBuilder().setTitle('ОКРУГ').setColor(0x2F3136)
		.setDescription('На сервере существуют чаты и ветки для каждого субъекта России, но чтобы получить к ним доступ, нужно взять роль, соответствующую твоему округу. ' +
			'Ниже ты можешь выбрать роль своего округа, и получить возможность устроить с кем-то встречу, либо стать первым в своём субъекте. Так же, ты можешь взять роль <@&1033353410793185322>, чтобы получить доступ к просмотру чата каждого субъекта')],
	components: [
		new ActionRowBuilder().addComponents([
			new SelectMenuBuilder().setCustomId('selectDistrict')
				.setPlaceholder('Ничего не выбрано')
				.addOptions(
          { label: 'ВСЕ ОКРУГА', value: '1033353410793185322' },
					{ label: 'ЦЕНТРАЛЬНЫЙ ОКРУГ', value: '1031026434870878227' },
					{ label: 'СЕВЕРО-ЗАПАДНЫЙ ОКРУГ', value: '1031026434870878226' },
					{ label: 'ЮЖНЫЙ ОКРУГ', value: '1031026434870878225' },
					{ label: 'ПРИВОЛЖСКИЙ ОКРУГ', value: '1031026434870878224' },
					{ label: 'УРАЛЬСКИЙ ОКРУГ', value: '1031026434870878223' },
					{ label: 'СИБИРСКИЙ ОКРУГ', value: '1031026434870878222' },
					{ label: 'ДАЛЬНЕВОСТОЧНЫЙ ОКРУГ', value: '1031026434870878221' },
					{ label: 'СЕВЕРО-КАВКАЗСКИЙ ОКРУГ', value: '1031026434870878220' })]),
		new ActionRowBuilder().addComponents([
			new ButtonBuilder().setLabel('Назад').setCustomId('backToRoles').setStyle(ButtonStyle.Primary).setEmoji('🔙')])],
};


menu.feedback = {
	modal: new ModalBuilder().setCustomId('feedbackModal').setTitle('Отзыв')
		.addComponents(new ActionRowBuilder().addComponents(
			new TextInputBuilder().setCustomId('feedbackInput')
				.setLabel('Здесь ты можешь оставить свой отзыв:')
				.setStyle(TextInputStyle.Paragraph))),
	replyMsg: { content: 'Спасибо за отзыв!', ephemeral: true },
};
