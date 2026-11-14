# Sourced by deploy.sh. Classifies the com.docker.compose.project.config_files
# label of a live DevKofi container.
#   base     - started from this checkout's compose.yaml alone
#   overlay  - started by deploy.sh with its tracked candidate or rollback overlay
#   external - a single Compose file elsewhere (pre-deploy.sh migration path)
# Any other combination of files returns 1.
classify_compose_label() {
  local root="$1" state="$2" label="$3"
  case "$label" in
    "$root/compose.yaml") echo base ;;
    "$root/compose.yaml,$state/candidate.yaml" | "$root/compose.yaml,$state/rollback.yaml") echo overlay ;;
    "" | *,*) return 1 ;;
    *) echo external ;;
  esac
}
