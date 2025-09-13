/**
 * Joins strings with /
 * @param {...string} parts splitted path parts
 * @returns {string} joined path
 */
function joinPath() {
  var parts = [];
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      var part = arguments[i].replace(/^\/+|\/+$/g, '');
      if (part) {
        parts.push(part);
      }
    }
  }
  return parts.join('/');
}

/**
 * Resolve relative path with base path
 * @param {string} basePath - parent module dir
 * @param {string} relativePath - relative path
 * @returns {string} absolute path
 */
function resolveRelativePath(basePath, relativePath) {
  if (!basePath) {
    throw new Error('Base path is required for relative resolution');
  }
  if (!relativePath) {
    throw new Error('Relative path cannot be empty');
  }

  var baseParts = basePath.split('/').filter(Boolean);
  var relativeParts = relativePath.split('/').filter(Boolean);

  for (var i = 0; i < relativeParts.length; i++) {
    var part = relativeParts[i];

    if (part === '.') {
      continue;
    } else if (part === '..') {
      if (baseParts.length > 0) {
        baseParts.pop();
      }
    } else {
      baseParts.push(part);
    }
  }

  return baseParts.join('/');
}

/**
 * Resolving aliases to absolute paths
 * @param {string} requestPath - path with alias (Example: '@components/Button')
 * @returns {string} absolute path
 */
function resolveAlias(requestPath) {
  if (!requestPath) {
    throw new Error('Empty alias path');
  }

  if (!window.ALIASES) {
    throw new Error('Aliases not configured. Use $import.addAlias() first');
  }

  var parts = requestPath.split('/');
  var alias = parts[0];

  if (!alias) {
    throw new Error('Invalid alias path: ' + requestPath);
  }

  if (!window.ALIASES[alias]) {
    var message =
      'Alias not found: "' +
      alias +
      '". Available: ' +
      Object.keys(window.ALIASES).join(', ');
    throw new Error(message);
  }

  var modulePath = parts.slice(1).join('/');
  var aliasBase = window.ALIASES[alias];

  return joinPath(aliasBase, modulePath);
}

/**
 * Check known file extension
 * @param {string} path file path
 * @returns {boolean} true if file has known extension
 */
function hasKnownExtension(path) {
  var filename = path.split('/').pop();
  var knownExtensions = [
    '.js',
    '.html',
    '.css',
    '.json',
    '.txt',
    '.xml',
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
  ];
  return knownExtensions.some(
    function (ext) {
      return filename.toLowerCase().endsWith(ext);
    }.bind(this)
  );
}

/**
 * Resolve path function
 * @param {string} requestPath - absolute, relative or alias path
 * @param {string} [parentDir] - path of paren module
 * @returns {string} absolute file path
 */
function resolvePath(requestPath, parentDir) {
  if (!requestPath) {
    throw new Error('Import path cannot be empty');
  }

  var fullPath;

  if (requestPath.startsWith('./') || requestPath.startsWith('../')) {
    if (!parentDir) {
      throw new Error('Relative import requires parent directory context');
    }
    fullPath = resolveRelativePath(parentDir, requestPath);
  } else if (requestPath.startsWith('/')) {
    fullPath = requestPath.substring(1);
  } else {
    fullPath = resolveAlias(requestPath);
  }

  if (hasKnownExtension(fullPath)) {
    return fullPath;
  }

  if (fullPath.includes('.')) {
    return fullPath + '.js';
  }

  return fullPath + '.js';
}

window.resolvePath = resolvePath;
