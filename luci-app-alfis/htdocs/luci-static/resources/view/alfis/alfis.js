'use strict';

'require view';
'require form';


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

        o.datatype = 'host';


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
