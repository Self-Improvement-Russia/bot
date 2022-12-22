import {
	SlashCommandBuilder,
	CommandInteraction,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	ModalBuilder,
	TextInputStyle,
	TextInputBuilder,
	ButtonInteraction,
	InteractionReplyOptions,
	TextBasedChannel,
	InteractionUpdateOptions,
	MessageComponentInteraction,
	RoleManager,
	GuildMemberRoleManager,
	GuildMember,
	CommandInteractionOptionResolver,
	StringSelectMenuInteraction
} from "discord.js";
import { infoChannelId, infoMessageId } from "../botConfig.json";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("menu")
		.setDescription("Updates info menu.")
		.setDMPermission(false)
		.addBooleanOption((option) => option.setName("resend").setDescription("Resend menu message or edit existing one").setRequired(true)),
	async execute(interaction: CommandInteraction) {
		let infoChannel = (await interaction.guild!.channels.fetch(infoChannelId)) as TextBasedChannel;
		let infoMessage = await infoChannel.messages.fetch(infoMessageId);
		await interaction.deferReply().then(async () => {
			await interaction.deleteReply().then(async () => {
				const options = interaction.options as CommandInteractionOptionResolver;
				return options.getBoolean("resend") ? await infoChannel.send(menu.messages.mainMessage) : await infoMessage.edit(menu.messages.mainMessage);
			});
		});
	}
};

async function giveRole(i: MessageComponentInteraction, roleId: string) {
	if ((!i.isButton() && !i.isStringSelectMenu) || !i.inGuild()) return;
	const memberRoleManager = i.member.roles as GuildMemberRoleManager;
	const guildRoleManager = i.guild!.roles as RoleManager;
	const member = i.member as GuildMember;
	let desc;
	if (memberRoleManager.cache.has(roleId)) {
		memberRoleManager.remove(roleId);
		desc = `**-** <@&${roleId}>`;
		console.log(`- @${(await guildRoleManager.fetch(roleId))!.name} to ${member.displayName}`);
	} else {
		memberRoleManager.add(roleId);
		desc = `**+** <@&${roleId}>`;
		console.log(`+ @${(await guildRoleManager.fetch(roleId))!.name} to ${member.displayName}`);
	}
	return i.reply({
		embeds: [new EmbedBuilder().setTitle("Твои роли были изменены:").setColor(0x2f3136).setDescription(desc)],
		ephemeral: true
	});
}

const menu: {
	messages: {
		mainMessage: any;
		rules: any;
		guide: InteractionReplyOptions & {
			firstPage: InteractionUpdateOptions;
			secondPage: InteractionUpdateOptions;
			thirdPage: InteractionUpdateOptions;
			endPage: InteractionUpdateOptions;
		};
		roles: InteractionReplyOptions &
			InteractionUpdateOptions & {
				district: InteractionUpdateOptions;
				age: InteractionUpdateOptions;
				notifications: InteractionUpdateOptions;
			};
	};
	actions: (inter: ButtonInteraction) => void;
	feedback: {
		modal: ModalBuilder;
		replyMsg: InteractionReplyOptions;
	};
} = {
	actions: async (inter: ButtonInteraction | StringSelectMenuInteraction) => {
		switch (inter.customId) {
			// Main Menu
			case "feedback":
				return await inter.showModal(menu.feedback.modal);
			// Guide
			case "guide1":
				return await inter.update(menu.messages.guide.firstPage);
			case "guide2":
				return await inter.update(menu.messages.guide.secondPage);
			case "guide3":
				return await inter.update(menu.messages.guide.thirdPage);
			case "guideEnd":
				return await inter.update(menu.messages.guide.endPage);
			// Roles
			case "district":
				return await inter.update(menu.messages.roles.district);
			case "age":
				return await inter.update(menu.messages.roles.age);
			case "notifications":
				return await inter.update(menu.messages.roles.notifications);
			case "backToRoles":
				return await inter.update(menu.messages.roles);
			// Roles > District
			case "selectDistrict":
				if (inter.isSelectMenu()) return await giveRole(inter, inter.values[0]);
			// Roles > Age
			case "<15":
				return await giveRole(inter, "1034418249472933978");
			case "15-17":
				return await giveRole(inter, "1034418084401909871");
			case "18+":
				return await giveRole(inter, "1034418030115037224");
			// Roles > Notifications
			case "events":
				return await giveRole(inter, "1034419008730046474");
			case "news":
				return await giveRole(inter, "1034418896595337226");
			case "international":
				return await giveRole(inter, "1034419058461904927");
			case "feed":
				return await giveRole(inter, "1034418960797548544");
		}
	},

	feedback: {
		modal: new ModalBuilder()
			.setCustomId("feedbackModal")
			.setTitle("Отзыв")
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder().setCustomId("feedbackInput").setLabel("Здесь ты можешь оставить свой отзыв:").setStyle(TextInputStyle.Paragraph)
				)
			),
		replyMsg: { content: "Спасибо за отзыв!", ephemeral: true }
	},

	messages: {
		mainMessage: {
			embeds: [
				new EmbedBuilder()
					.setTitle("Добро пожаловать на Self Improvement Russia!")
					.setColor(0x2f3136)
					.setThumbnail("https://cdn.discordapp.com/icons/999969234425761913/0ad835fb41365c7e01376ff1f0b13837.png?size=4096")
					.setDescription(
						"Мы стремимся объединить участников движения саморазвития в России, **чтобы помочь и поддержать рост друг друга**, независимо от того, " +
							"на каком этапе своего пути вы находитесь. :compass:\n\nМы предлагаем несколько фантастических возможностей для того, чтобы вы могли делиться идеями, " +
							"обмениваться советами, слушать информативные мероприятия, получать обратную связь, оставаться подотчетными и **создавать значимую жизнь для себя и других**. " +
							":muscle_tone1:\n\nНаши интерактивные кнопки, расположенные под этим сообщением, позволят вам ознакомиться с нашими правилами, " +
							"получить краткое руководство по нашему сообществу, настроить свои роли и получить доступ к новым чатам, отправить нам отзыв, а также получить доступ к нашей **обширной и постоянно растущей библиотеке знаний в Notion!** " +
							"Приятного вам пребывания, и не забудьте поздороваться с нами в <#999969235314954332>"
					)
					.setFooter({ text: "Перманентная ссылка на сервер: https://discord.gg/wJkwr4PRFP" })
			],
			components: [
				new ActionRowBuilder().addComponents([
					new ButtonBuilder().setLabel("Правила").setCustomId("rules").setStyle(ButtonStyle.Success).setEmoji("<:bookopen:1042704522449010759>"),
					new ButtonBuilder().setLabel("Руководство").setCustomId("guide").setStyle(ButtonStyle.Primary).setEmoji("<:signalt:1042704534436315169>"),
					new ButtonBuilder().setLabel("Роли").setCustomId("roles").setStyle(ButtonStyle.Primary).setEmoji("<:awardalt:1042704519655587860>"),
					new ButtonBuilder().setLabel("Отзыв").setCustomId("feedback").setStyle(ButtonStyle.Secondary).setEmoji("<:commentaltmessage:1042704525921878037>"),
					new ButtonBuilder()
						.setLabel("Notion")
						.setURL("https://gertsen.notion.site/Self-Improvement-Russia-d5f4aa0c936c4154a6863cdffca92c8f")
						.setStyle(ButtonStyle.Link)
						.setEmoji("<:notion:1042708214069866588>")
				])
			]
		},

		rules: {
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("Правила")
					.setColor(0x2f3136)
					.setDescription(
						"**Будь уважительным.**\n" +
							"Никто не хочет видеть здесь спам, NSFW, рекламу или политические разговоры. Держи эти темы подальше от нашего сообщества и личных сообщений участников.\n\n" +
							"**Будь адекватным.**\n" +
							"Когда дебаты перерастают в спор, подумай о том, чтобы уйти из чата. Команда может вмешаться, и мы просим тебя прислушаться к нам, так как мы здесь, чтобы помочь.\n\n" +
							"**Будь сознательным.**\n" +
							"Помоги нам сохранить общение максимально высококачественным, интересным и содержательным, а так же держи его в подходящих чатах и избегай оффтоп.\n\n"
					)
			]
		},

		guide: {
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("Руководство")
					.setColor(0x2f3136)
					.setDescription(
						"Как новый участник этого сервера, ты можешь столкнуться с несколькими вещами, которые пока не можешь полностью понять.\n" +
							"Чтобы помочь тебе освоиться, мы создали это руководство, в котором шаг за шагом рассказывается обо всем, что тебе нужно знать.\n"
					)
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents([
					new ButtonBuilder().setLabel("Начать").setCustomId("guide1").setStyle(ButtonStyle.Success).setEmoji("<:play:1042704531835867217>")
				])
			],

			firstPage: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Руководство > Важные роли (1/3)")
						.setColor(0x2f3136)
						.setDescription(
							"<:shield:1036567108106072084> <@&1034415439910019113>\n" +
								"	Команда включает в себя владельца сервера, администраторов, модераторов, и прочих причастных к развитию сервера.\n\n" +
								"<:shield:1036567108106072084> <@&1034415566624133200>\n" +
								"	Администраторы занимаются улучшением сервера, изменением его структуры, добавлением новых каналов, т.д. т.п.. Если у тебя есть вопросы по поводу правил, саморекламы или каких-то изменений, можешь писать им.\n\n" +
								"<:shield:1036567108106072084> <@&1034415714871812126>\n" +
								"	Модераторы модерируют. Можешь обращатся к ним, если считаешь, что кто-то нарушил правила или неадекватно себя ведёт. В случае недоступности модераторов, можешь обращатся к администраторам.\n\n" +
								"<:robot:1036569379392987146> <@&1034415776196743260>\n" +
								"	Главный бот сервера, <@1005869599612481627>. Именно с помощью этого бота ты читаешь это руководство, а в будущем с его помощью можно будет смотреть свою репутацию на сервере и делать много других вещей.\n\n"
						)
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setCustomId("disabled").setStyle(ButtonStyle.Primary).setEmoji("<:angleleftb:1042704516241444904>").setDisabled(true),
						new ButtonBuilder().setCustomId("guide2").setStyle(ButtonStyle.Primary).setEmoji("<:anglerightb:1042704518065950740>")
					])
				]
			},

			secondPage: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Руководство > Категории (2/3)")
						.setColor(0x2f3136)
						.setDescription(
							"**📌 Прикреплено**\n" +
								"В этой категории можно найти важную информацию, различные новости, а так же всё, связанное с событиями.\n\n" +
								"**💡 Форумы**\n" +
								"Тут ты можешь начать обсуждение на какую-то конкретную тему и поделиться своим мнением. Дополнительную информацию о форумах можно узнать на следующей странице руководства \n\n" +
								"**💬 Чат**\n" +
								'Категория "Чат" содержит в себе... правильно, чаты.\n\n' +
								"**🏳 Округа**\n" +
								'В чатах этой категории можно общаться с участниками сервера из вашего города/области, а так же планировать встречи. Чтобы получить доступ к этим чатам, нужно взять роль в разделе "Роли" главного меню\n\n'
						)
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setCustomId("guide1").setStyle(ButtonStyle.Primary).setEmoji("<:angleleftb:1042704516241444904>"),
						new ButtonBuilder().setCustomId("guide3").setStyle(ButtonStyle.Primary).setEmoji("<:anglerightb:1042704518065950740>")
					])
				]
			},

			thirdPage: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Руководство > Форумы (3/3)")
						.setColor(0x2f3136)
						.setDescription(
							"Форумы - специальные каналы для разнообразных обсуждений. У каждого форума на сервере есть своя тема (в названии) и теги, которыми можно точнее обозначить тему твоего поста. Ниже перечислены несколько возможных тем для каждого форума:\n\n" +
								"<#1034420217679454209> — психическое здоровье, медитация, зависимость\n" +
								"<#1034420252295057439> — боевые искусства, спорт, тренировки\n" +
								"<#1034420284717015090> — набор веса, сушка, пищевые добавки, рецепты\n" +
								"<#1034420403470344202> — гигиена сна, кожи, полости рта, уход за собой\n" +
								"<#1034420449205030963> — режим дня, рутина, второй мозг\n" +
								"<#1034420491701719071> — инвестирование, предпринимательство, финансы\n" +
								"<#1034420528502554646> — семья, язык тела, речь, романтичность\n" +
								"<#1034420568285524028> — стоицизм, экзистенциализм, нигилизм\n" +
								"<#1034420607070257154> — путешествия, искусство, творчество, религия"
						)
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setCustomId("guide2").setStyle(ButtonStyle.Primary).setEmoji("<:angleleftb:1042704516241444904>"),
						new ButtonBuilder().setCustomId("guideEnd").setStyle(ButtonStyle.Success).setEmoji("<:check:1042704524076388382>")
					])
				]
			},

			endPage: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Руководство > Конец")
						.setColor(0x2f3136)
						.setDescription(
							'Мы надеемся, что это краткое введение поможет понять структуру сервера, а также то, как он может принести тебе пользу. Если ты хочешь поделиться мыслями о нас, этом руководстве или о чём-либо на сервере, используй кнопку "Отзыв" в главном меню.'
						)
				],
				components: []
			}
		},

		roles: {
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("Роли")
					.setColor(0x2f3136)
					.setDescription(
						"Чтобы настроить уведомления, получить возможность участвовать во встречах, а так же помочь другим понять тебя и твою жизненную ситуацию, " +
							"нажми на одну из ролевых категорий ниже и выбери соответствующие роли."
					)
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents([
					new ButtonBuilder().setLabel("Округ").setCustomId("district").setStyle(ButtonStyle.Primary).setEmoji("<:mapmarker:1042704528899854346> "),
					new ButtonBuilder().setLabel("Возраст").setCustomId("age").setStyle(ButtonStyle.Primary).setEmoji("<:13plus:1042704514416918569>"),
					new ButtonBuilder().setLabel("Уведомления").setCustomId("notifications").setStyle(ButtonStyle.Primary).setEmoji("<:notifications:1042704520825802773>")
				])
			],

			district: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Роли > Округ")
						.setColor(0x2f3136)
						.setDescription(
							"На сервере существуют чаты и ветки для каждого субъекта России, но чтобы получить к ним доступ, нужно взять роль, соответствующую твоему округу. " +
								"Ниже ты можешь выбрать роль своего округа, и получить возможность устроить с кем-то встречу, либо стать первым в своём субъекте."
						)
				],
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
						new StringSelectMenuBuilder()
							.setCustomId("selectDistrict")
							.setPlaceholder("Ничего не выбрано")
							.addOptions(
								{ label: "Центральный округ", value: "1000777950192476200" },
								{ label: "Северо-Западный округ", value: "1000778093419569252" },
								{ label: "Южный округ", value: "1000778165888745543" },
								{ label: "Приволжский округ", value: "1000778190547079278" },
								{ label: "Уральский округ", value: "1000778211271114752" },
								{ label: "Сибирский округ", value: "1000778230099345420" },
								{ label: "Дальневосточный округ", value: "1000778248407498824" },
								{ label: "Северо-Кавказский округ", value: "1000778270733770912" }
							)
					]),
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setLabel("Назад").setCustomId("backToRoles").setStyle(ButtonStyle.Secondary).setEmoji("<:angleleftb:1042704516241444904>")
					])
				]
			},

			age: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Роли > Возраст")
						.setColor(0x2f3136)
						.setDescription(
							"Чтобы помочь другим пользователям лучше понять тебя и твой текущий жизненный опыт, ты можешь настроить свой профиль с помощью наших возрастных ролей. " +
								"Мы предлагаем тебе 3 варианта на выбор. Пожалуйста, выбери тот, который соответствует действительности"
						)
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setLabel("Меньше 15").setCustomId("<15").setStyle(ButtonStyle.Primary).setEmoji("👦"),
						new ButtonBuilder().setLabel("15-17").setCustomId("15-17").setStyle(ButtonStyle.Primary).setEmoji("🧑"),
						new ButtonBuilder().setLabel("18+").setCustomId("18+").setStyle(ButtonStyle.Primary).setEmoji("👨")
					]),
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setLabel("Назад").setCustomId("backToRoles").setStyle(ButtonStyle.Secondary).setEmoji("<:angleleftb:1042704516241444904>")
					])
				]
			},

			notifications: {
				embeds: [
					new EmbedBuilder()
						.setTitle("Роли > Уведомления")
						.setColor(0x2f3136)
						.setDescription(
							"В этом разделе ты можешь взять роль, чтобы получать уведомления о каких-то событиях, изменениях в сервере, новостях сообщества и т.д.\n" +
								"<@&1034418896595337226> — изменения и обновления сервера\n" +
								"<@&1034418960797548544> — новости нашего сообщества, встречи и различные достижения\n" +
								"<@&1034419008730046474> — события нашего сервера\n" +
								"<@&1034419058461904927> — события, происходящие на Adonis.House\n"
						)
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setLabel("Новости").setCustomId("news").setStyle(ButtonStyle.Primary).setEmoji("<:news:1042704530355261490>"),
						new ButtonBuilder().setLabel("Лента").setCustomId("feed").setStyle(ButtonStyle.Primary).setEmoji("<:rss:1042704533236752394>"),
						new ButtonBuilder().setLabel("События").setCustomId("events").setStyle(ButtonStyle.Primary).setEmoji("<:events:1042704527452819456>"),
						new ButtonBuilder()
							.setLabel("Международные События")
							.setCustomId("international")
							.setStyle(ButtonStyle.Primary)
							.setEmoji("<:globe:1043623333306056725>")
					]),
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder().setLabel("Назад").setCustomId("backToRoles").setStyle(ButtonStyle.Secondary).setEmoji("<:angleleftb:1042704516241444904>"),
						new ButtonBuilder()
							.setLabel("Adonis.House")
							.setStyle(ButtonStyle.Link)
							.setEmoji("<:adonishouse:1043624032555241514>")
							.setURL("https://discord.gg/mWzZBNwqz6")
					])
				]
			}
		}
	}
};

module.exports.menu = menu;
