const { join } = require('path');
const { axios, checkCommand, logger, cqcode } = require('kokkoro');

// 获取 GitHub 相关 og 信息
function getGithub(event, setting) {
  const { github } = setting;
  const { raw_message, reply } = event;
  const [url] = raw_message.match(/https:\/\/github.com\/[\w\/]*/g);

  github && axios.get(url)
    .then(response => {
      const { data } = response;
      const { image } = getMetaOg(data);

      // 获取图片失败不用 catch 处理
      cqcode.image(image).then(response => {
        reply(response);
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

const default_setting = {
  github: true,
}

function listener(event) {
  const dir = join(this.dir, 'config.json');
  const setting = require(dir)[event.group_id].setting.og;
  const mission = checkCommand(command, event.raw_message);

  setting.switch && eval(`${mission}.bind(this)(event, setting)`);
}

function enable(bot) {
  bot.on('message.group', listener);
}

function disable(bot) {
  bot.off('message.group', listener);
}

module.exports = {
  enable, disable, default_setting
}