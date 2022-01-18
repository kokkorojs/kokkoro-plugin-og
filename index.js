const axios = require('axios');
const { checkCommand, logger, section, getOption } = require('kokkoro-core');

// 获取 GitHub 相关 og 信息
function getGithub(event, option) {
  const { github } = option;
  const { raw_message } = event;
  const [url] = raw_message.match(/https:\/\/github.com\/[\w\/]*/g);

  github && axios.get(url)
    .then(response => {
      const { data } = response;
      const { image } = getMetaOg(data);

      // 获取图片失败不用 catch 处理
      section.image(image).then(response => {
        event.reply(response);
      })
    })
    .catch(error => {
      logger.error(error.message);
    })
}

// 获取 meat 标签 og 属性
function getMetaOg(html) {
  const og = {};
  const reg = /<meta property="og:[\w:]+" content="[^"]+" \/>/g;
  const metas = html.match(reg);

  for (const meta of metas) {
    const reg = /property="og:(?<property>.+)" content="(?<content>.+)"/;
    const { groups } = reg.exec(meta);
    const { property, content } = groups;

    og[property] = content;
  }

  return og;
}

const command = {
  getGithub: /https:\/\/github.com\//,
}

const default_option = {
  github: true,
}

function listener(event) {
  const option = getOption(event);
  const mission = checkCommand(command, event.raw_message);

  if (option.apply) {
    mission && eval(`${mission}.bind(this)(event, option)`);
  }
}

function enable(bot) {
  bot.on('message.group', listener);
}

function disable(bot) {
  bot.off('message.group', listener);
}

module.exports = {
  enable, disable, default_option
}