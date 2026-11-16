# Sourced by deploy.sh. Classifies the com.docker.compose.project.config_files
# label of a live DevKofi container.
#   base     - started from this checkout's compose.yaml alone
#   overlay  - started by deploy.sh with its tracked candidate or rollback overlay
#   legacy   - started by deploy.sh from the previous checkout (DEPLOY_LEGACY_ROOT),
#              accepted only while releases migrate to a new checkout
#   external - a single Compose file elsewhere (pre-deploy.sh migration path)
# Any other combination of files returns 1.
classify_compose_label() {
  local root="$1" state="$2" label="$3" legacy="${4:-}"
  case "$label" in
    "$root/compose.yaml") echo base; return ;;
    "$root/compose.yaml,$state/candidate.yaml" | "$root/compose.yaml,$state/rollback.yaml") echo overlay; return ;;
  esac
  if [[ -n "$legacy" && "$legacy" == /* && "$legacy" != "$root" ]]; then
    case "$label" in
      "$legacy/compose.yaml" | "$legacy/compose.yaml,$legacy/.deploy-state/candidate.yaml" | "$legacy/compose.yaml,$legacy/.deploy-state/rollback.yaml")
        echo legacy; return ;;
    esac
  fi
  case "$label" in
    "" | *,*) return 1 ;;
    *) echo external ;;
  esac
}
