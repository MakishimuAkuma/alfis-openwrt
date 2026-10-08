'use strict';

'require view';
'require form';
'require rpc';
'require validation';


var callServiceList = rpc.declare({
    object: 'service',
    method: 'list',
    params: ['name'],
    expect: { '': {} },
});

function getAlfisStatus() {
    return L.resolveDefault(callServiceList('alfis'), {}).then(function(res) {
        try {
            var instances = res['alfis']['instances'];
            for (var key in instances) {
                if (instances[key].running)
                    return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    });
}

function renderStatus(isRunning) {
    var span = '<span style="color:%s"><strong>%s</strong></span>';

    return isRunning
    ? String.format(span, 'green', _('RUNNING'))
    : String.format(span, 'red', _('NOT RUNNING'));
}


return view.extend({
    render: function() {
        var m;
        var s;
        var o;


        m = new form.Map(
            'alfis',
            _('Alfis'),
                         _('Alternative Free Identity System configuration.')
        );


        /*
         * Status
         */

        s = m.section(form.NamedSection);
        s.anonymous = true;
        s.render = function() {
            L.Poll.add(function() {
                return getAlfisStatus().then(function(running) {
                    var view = document.getElementById('alfis-status');
                    if (view)
                        view.innerHTML = renderStatus(running);
                });
            });

            return E('div', { class: 'cbi-section' }, [
                E('p', {}, [
                    E('strong', {}, _('Service status') + ': '),
                  E('span', { id: 'alfis-status' }, _('Loading...'))
                ])
            ]);
        };


        /*
         * General
         */

        s = m.section(
            form.NamedSection,
                'main',
                'alfis',
                _('General'),
                      _('General Alfis node settings.')
        );

        s.anonymous = true;
        s.addremove = false;


        o = s.option(
            form.Value,
                'origin',
                _('Origin'),
                     _('Hash of the first block in the chain.')
        );

        o.datatype = 'string';
        o.rmempty = false;


        o = s.option(
            form.Value,
                'check_blocks',
                _('Check blocks'),
                     _('Number of the last blocks checked when Alfis starts.')
        );

        o.datatype = 'uinteger';
        o.default = '8';
        o.rmempty = false;


        o = s.option(
            form.Flag,
                'dark_theme',
                _('Dark theme'),
                     _('Render the native Alfis GUI using the dark theme.')
        );

        o.default = '1';


        o = s.option(
            form.DynamicList,
                'key_file',
                _('Key files'),
                     _('Key files loaded automatically by Alfis.')
        );

        o.datatype = 'string';


        o = s.option(
            form.Value,
                'work_dir',
                _('Working directory'),
                     _('Directory where Alfis stores its blockchain database and key files. Changing this only takes effect after the service is restarted, and the new directory must be writable by the unprivileged "alfis" user the service runs as.')
        );

        o.datatype = 'string';
        o.default = '/etc/alfis';
        o.rmempty = false;
        o.placeholder = '/etc/alfis';


        /*
         * Network
         */

        s = m.section(
            form.NamedSection,
                'net',
                'net',
                _('Network'),
                      _('Alfis peer-to-peer network settings.')
        );

        s.anonymous = true;
        s.addremove = false;


        o = s.option(
            form.DynamicList,
                'peer',
                _('Bootstrap peers'),
                     _('Initial peers used to join the Alfis network.')
        );

        o.datatype = 'string';
        o.placeholder = 'host:port, 1.2.3.4:4244 or [2001:db8::1]:4244';

        // LuCI has no single built-in datatype for "hostname-or-IPv4-or-
        // bracketed-IPv6 : port" together, so validate it by hand using
        // the low-level validation.parseIPv4()/parseIPv6() helpers (pure
        // functions, safe to call directly without an instance).
        //
        // Accepted forms (port is always optional):
        //   host            host:port
        //   1.2.3.4         1.2.3.4:port
        //   2001:db8::1     [2001:db8::1]:port
        //   [2001:db8::1]
        //
        // A port MUST always be bracketed for IPv6, same as in any URI —
        // otherwise "2001:db8::1:4244" would be ambiguous between "an
        // extra IPv6 group" and ":port".
        var isValidPort = function(p) {
            return /^\d{1,5}$/.test(p) && +p >= 1 && +p <= 65535;
        };

        var isValidHostname = function(h) {
            return h.length > 0 && h.length <= 253 &&
            /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(h) &&
            // must contain at least one non-digit/non-dot character,
            // otherwise something like "999.1.1.1" (an invalid IPv4)
            // would wrongly slip through as a "hostname"
            /[^0-9.]/.test(h);
        };

        var errMsg = _('Expecting: valid host, host:port, IPv4[:port], [IPv6][:port] or bare IPv6');

        o.validate = function(section_id, value) {
            if (value == null || value === '')
                return true;

            // [IPv6]:port
            var m6p = value.match(/^\[(.+)\]:(\d+)$/);
            if (m6p)
                return (validation.parseIPv6(m6p[1]) != null && isValidPort(m6p[2])) || errMsg;

            // [IPv6], no port
            var m6 = value.match(/^\[(.+)\]$/);
            if (m6)
                return (validation.parseIPv6(m6[1]) != null) || errMsg;

            // bare (unbracketed) IPv6, no port — has 2+ colons and parses
            // as a real IPv6 address (must be checked before the
            // single-colon host:port case below)
            if (value.indexOf(':') !== value.lastIndexOf(':') && validation.parseIPv6(value) != null)
                return true;

            // host:port or IPv4:port (single colon)
            var m4p = value.match(/^([^\[\]:]+):(\d+)$/);
            if (m4p)
                return ((validation.parseIPv4(m4p[1]) != null || isValidHostname(m4p[1])) && isValidPort(m4p[2])) || errMsg;

            // bare hostname or IPv4, no port, no colon at all
            if (value.indexOf(':') === -1)
                return (validation.parseIPv4(value) != null || isValidHostname(value)) || errMsg;

            return errMsg;
        };


        o = s.option(
            form.Value,
                'listen',
                _('Listen address'),
                     _('Address and port where Alfis accepts peer connections.')
        );

        o.datatype = 'string';
        o.default = '[::]:4244';
        o.rmempty = false;


        o = s.option(
            form.Flag,
                'public',
                _('Public'),
                     _('Allow this node address to participate in peer exchange.')
        );

        o.default = '1';


        o = s.option(
            form.Flag,
                'yggdrasil_only',
                _('Yggdrasil only'),
                     _('Allow connections to and from Yggdrasil only.')
        );

        o.default = '0';


        /*
         * DNS
         */

        s = m.section(
            form.NamedSection,
                'dns',
                'dns',
                _('DNS'),
                      _('Alfis DNS resolver settings.')
        );

        s.anonymous = true;
        s.addremove = false;


        o = s.option(
            form.Value,
                'listen',
                _('Listen address'),
                     _('Address and port used by the Alfis DNS resolver.')
        );

        o.datatype = 'string';
        o.default = '127.0.0.3:53';
        o.rmempty = false;


        o = s.option(
            form.Value,
                'threads',
                _('Threads'),
                     _('Number of DNS server threads.')
        );

        o.datatype = 'uinteger';
        o.default = '10';
        o.rmempty = false;


        o = s.option(
            form.Value,
                'cache_memory_limit_mb',
                _('Cache memory limit'),
                     _('Maximum DNS cache memory in megabytes. Set to 0 for unlimited.')
        );

        o.datatype = 'uinteger';
        o.default = '100';
        o.rmempty = false;


        o = s.option(
            form.DynamicList,
                'forwarder',
                _('Forwarders'),
                     _('DNS servers used for regular DNS queries.')
        );

        o.datatype = 'string';


        o = s.option(
            form.DynamicList,
                'bootstrap',
                _('Bootstrap DNS servers'),
                     _('DNS servers used to resolve DoH provider hostnames.')
        );

        o.datatype = 'string';


        o = s.option(
            form.Flag,
                'enable_0x20',
                _('DNS 0x20 protection'),
                     _('Enable DNS 0x20 encoding for cache poisoning protection.')
        );

        o.default = '1';


        o = s.option(
            form.Flag,
                'hosts_enabled',
                _('Enable hosts files'),
                     _('Enable additional hosts files.')
        );

        o.default = '0';


        o = s.option(
            form.DynamicList,
                'host',
                _('Hosts files'),
                     _('Hosts files supported by Alfis, for example system or adblock.txt.')
        );

        o.datatype = 'string';
        o.depends('hosts_enabled', '1');


        /*
         * Mining
         */

        s = m.section(
            form.NamedSection,
                'mining',
                'mining',
                _('Mining'),
                      _('CPU mining settings.')
        );

        s.anonymous = true;
        s.addremove = false;


        o = s.option(
            form.Value,
                'threads',
                _('Threads'),
                     _('Number of CPU threads used for mining. 0 means all CPU cores.')
        );

        o.datatype = 'uinteger';
        o.default = '0';
        o.rmempty = false;


        o = s.option(
            form.Flag,
                'lower',
                _('Lower priority'),
                     _('Run mining threads with lower CPU priority.')
        );

        o.default = '1';


        return m.render();
    }
});
